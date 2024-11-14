import { PeripheralModel } from "../models/peripheralCardModel";
import BleManager from "react-native-ble-manager";
import {
  RUN_CHARACTERISTIC_UUID,
  RUN_SERVICE_UUID,
  RUN_RESPONSE_CHARACTERISTIC_UUID,
} from "../assets/thems/ble_services";
import { Electrotherapy } from "../models/stimulateInfoModel";

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const sendCommand = async (
  peripheral: PeripheralModel,
  command: string,
  additionalInfo?: any,
) => {
  let data = "";
  if (command === "SET" || command === "RUN") {
    data = JSON.stringify({
      token: peripheral.token,
      command: command,
      ...(additionalInfo || {}),
    });
  } else if (command === "STOP") {
    data = "STOP";
  }
  console.log("sending command: ", data);
  try {
    await chunkAndSend(peripheral, data);
    let response = "";
    while (response !== command) {
      const responseData = await BleManager.read(
        peripheral.id,
        RUN_SERVICE_UUID,
        RUN_RESPONSE_CHARACTERISTIC_UUID,
      );
      response = String.fromCharCode(...responseData);
      await sleep(100);
    }
  } catch (error) {
    console.error(`Error executing ${command} command:`, error);
  }
};

const chunkAndSend = async (peripheral: PeripheralModel, data: string) => {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data + "\n");
  const chunkSize = 20;
  let index = 0;

  while (index < encodedData.length) {
    const chunk = encodedData.slice(index, index + chunkSize);
    await BleManager.write(
      peripheral.id,
      RUN_SERVICE_UUID,
      RUN_CHARACTERISTIC_UUID,
      Array.from(chunk),
    );
    index += chunkSize;
    await sleep(50);
  }

  console.log("Data with terminator sent in chunks.");
};

export const SET = async (
  peripheral: PeripheralModel,
  info: Electrotherapy,
) => {
  await sendCommand(peripheral, "SET", { info: info.toJSON() });
};

export const RUN = async (peripheral: PeripheralModel) => {
  await sendCommand(peripheral, "RUN");
};

export const STOP = async (peripheral: PeripheralModel) => {
  await sendCommand(peripheral, "STOP");
};
