import { PeripheralModel } from "../models/peripheralCardModel";
import BleManager from "react-native-ble-manager";
import {
  RUN_CHARACTERISTIC_UUID,
  RUN_SERVICE_UUID,
  RUN_RESPONSE_CHARACTERISTIC_UUID,
} from "../assets/thems/ble_services";
import { Electrotherapy } from "../models/stimulateInfoModel";

/**
 * Creates a promise that resolves after a specified delay.
 *
 * @param ms - The duration of the delay in milliseconds.
 * @returns A promise that resolves after the specified delay.
 */
const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Sends a command to the Bluetooth peripheral device.
 *
 * @param peripheral - The peripheral device to send the command to.
 * @param command - The command to be sent. Can be 'SET', 'RUN', or 'STOP'.
 * @param additionalInfo - Optional additional information required for 'SET' command.
 */
const sendCommand = async (
  peripheral: PeripheralModel,
  command: string,
  additionalInfo?: any,
): Promise<string|undefined> => {
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
      if (response === "INVALID_TOKEN"){
        console.log("Invalid token, please try again");
        return response;
      }
      const responseData = await BleManager.read(
        peripheral.id,
        RUN_SERVICE_UUID,
        RUN_RESPONSE_CHARACTERISTIC_UUID,
      );
      response = String.fromCharCode(...responseData);
      await sleep(100);
    }
    return response;
  } catch (error) {
    console.error(`Error executing ${command} command:`, error);
    return "INVALID_COMMAND";
  }
};

/**
 * Sends data to the Bluetooth peripheral device in chunks of a specified size.
 *
 * @param peripheral - The peripheral device to send the data to.
 * @param data - The data to be sent to the peripheral device.
 */
const chunkAndSend = async (peripheral: PeripheralModel, data: string) => {
  /**
   * Create a new TextEncoder instance to encode the data.
   * The TextEncoder API is used to encode string data into a Uint8Array binary format.
   */
  const encoder = new TextEncoder();

  /**
   * Encode the data with a newline character appended to it.
   * The newline character is added as a terminator to indicate the end of the data.
   */
  const encodedData = encoder.encode(data + "\n");

  /**
   * Define the size of each chunk of data to be sent.
   * The chunk size is set to 20 bytes in this case.
   */
  const chunkSize = 20;

  /**
   * Initialize an index variable to keep track of the current position in the encoded data.
   */
  let index = 0;

  /**
   * Loop through the encoded data in chunks of the specified size.
   * For each iteration, a chunk of data is sent to the peripheral device using the BleManager. write method.
   */
  while (index < encodedData.length) {
    /**
     * Create a chunk by slicing the encoded data on the current index and chunk size.
     */
    const chunk = encodedData.slice(index, index + chunkSize);

    /**
     * Send the chunk of data to the peripheral device.
     * BleManager.write is a method provided by the react-native-ble-manager library to write data to a Bluetooth peripheral.
     * It takes the peripheral ID, service UUID, characteristic UUID, and the data to be written as parameters.
     */
    await BleManager.write(
      peripheral.id,
      RUN_SERVICE_UUID,
      RUN_CHARACTERISTIC_UUID,
      Array.from(chunk),
    );

    /**
     * Increment the index by the chunk size to move to the next chunk of data.
     */
    index += chunkSize;

    /**
     * Introduce a small delay of 50 milliseconds between sending each chunk.
     * This delay can help ensure that the peripheral device has time to process each chunk before receiving the next one.
     */
    await sleep(50);
  }

  /**
   * Log a message to indicate that the data has been sent in chunks successfully.
   */
  console.log("Data with terminator sent in chunks.");
};

/**
 * Sends the 'SET' command to the Bluetooth peripheral device to configure it with the provided electrotherapy information.
 *
 * @param peripheral - The peripheral device to send the command to.
 * @param info - The electrotherapy information to be sent to the peripheral device.
 * @returns A promise that resolves when the command has been sent successfully.
 */
export const SET = async (
  peripheral: PeripheralModel,
  info: Electrotherapy,
) => {
  return await sendCommand(peripheral, "SET", { info: info.toJSON() });
};

/**
 * Sends the 'RUN' command to the Bluetooth peripheral device to start the electrotherapy session.
 *
 * @param peripheral - The peripheral device to send the command to.
 * @returns A promise that resolves when the command has been sent successfully.
 */
export const RUN = async (peripheral: PeripheralModel) => {
  return await sendCommand(peripheral, "RUN");
};

/**
 * Sends the 'STOP' command to the Bluetooth peripheral device to stop the electrotherapy session.
 *
 * @param peripheral - The peripheral device to send the command to.
 * @returns A promise that resolves when the command has been sent successfully.
 */
export const STOP = async (peripheral: PeripheralModel) => {
  return await sendCommand(peripheral, "STOP");
};
