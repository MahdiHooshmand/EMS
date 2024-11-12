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
  const data = JSON.stringify({
    token: peripheral.token,
    command: command,
    ...(additionalInfo || {}),
  });

  try {
    await BleManager.write(
      peripheral.id,
      RUN_SERVICE_UUID,
      RUN_CHARACTERISTIC_UUID,
      Array.from(new TextEncoder().encode(data)),
    );
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
