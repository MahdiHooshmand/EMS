import BleManager, {
  BleDisconnectPeripheralEvent,
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  Peripheral,
} from "react-native-ble-manager";
import {
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
  Platform,
} from "react-native";
import {
  ALLOW_DUPLICATES,
  SECONDS_TO_SCAN_FOR,
  SERVICE_UUIDS,
} from "../assets/strings/ble_conf";

/**
 * Module for BLE Manager native functionality.
 */
const BleManagerModule = NativeModules.BleManager;

/**
 * Event emitter for BLE Manager events.
 */
export const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

/**
 * Array to store event listeners.
 */
export let listeners: any[] = [];

/**
 * Interface defining the parameters for setting up BLE event listeners.
 */
interface setListenersParams {
  /**
   * Callback function triggered when a peripheral is discovered.
   * @param peripheral - The discovered peripheral device.
   */
  onDiscoverPeripheral: (peripheral: Peripheral) => void;

  /**
   * Callback function triggered when the BLE scan stops.
   */
  onStopScan: () => void;

  /**
   * Callback function triggered when a peripheral is disconnected.
   * @param event - The disconnect event containing information about the disconnected peripheral.
   */
  onDisconnectedPeripheral: (event: BleDisconnectPeripheralEvent) => void;
}

/**
 * Sets up event listeners for BLE Manager events.
 *
 * @param {setListenersParams} params - An object containing callback functions for various BLE events.
 * @param {((peripheral: Peripheral) => void)} params.onDiscoverPeripheral - Callback function triggered when a peripheral device is discovered.
 * @param {(() => void)} params.onStopScan - Callback function invoked when the BLE scan stops.
 * @param {((event: BleDisconnectPeripheralEvent) => void)} params.onDisconnectedPeripheral - Callback function executed when a peripheral is disconnected.
 * @returns {void} - This function does not return a value.
 */
export const setListeners = ({
  onDiscoverPeripheral,
  onStopScan,
  onDisconnectedPeripheral,
}: setListenersParams): void => {
  listeners = [
    bleManagerEmitter.addListener(
      "BleManagerDiscoverPeripheral",
      onDiscoverPeripheral,
    ),
    bleManagerEmitter.addListener("BleManagerStopScan", onStopScan),
    bleManagerEmitter.addListener(
      "BleManagerDisconnectPeripheral",
      onDisconnectedPeripheral,
    ),
  ];
};

/**
 * Handles Android permissions for Bluetooth functionality.
 *
 * This function checks the Android version and requests appropriate permissions:
 * - For Android 12+ (API 31+): Requests BLUETOOTH_SCAN and BLUETOOTH_CONNECT permissions.
 * - For Android 6+ (API 23+) but below 12: Checks and requests ACCESS_FINE_LOCATION permission.
 *
 * The function logs the user's response to the permission requests.
 *
 * @returns {void} This function does not return a value.
 */
const handleAndroidPermissions = (): void => {
  if (Platform.OS === "android" && Platform.Version >= 31) {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    ]).then((result) => {
      if (result) {
        console.log(
          "[handleAndroidPermissions] User accepts runtime permissions android 12+",
        );
      } else {
        console.log(
          "[handleAndroidPermissions] User refuses runtime permissions android 12+",
        );
      }
    });
  } else if (Platform.OS === "android" && Platform.Version >= 23) {
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ).then((checkResult) => {
      if (checkResult) {
        console.log(
          "[handleAndroidPermissions] runtime permission Android <12 already OK",
        );
      } else {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ).then((requestResult) => {
          if (requestResult) {
            console.log(
              "[handleAndroidPermissions] User accepts runtime permission android <12",
            );
          } else {
            console.log(
              "[handleAndroidPermissions] User refuses runtime permission android <12",
            );
          }
        });
      }
    });
  }
};

/**
 * Attempts to enable Bluetooth functionality on the device.
 *
 * This asynchronous function uses the BleManager to enable Bluetooth.
 * If an error occurs during the process, it will be caught and logged to the console.
 *
 * @returns {Promise<void>} A promise that resolves when Bluetooth is successfully enabled,
 *                          or rejects if an error occurs during the process.
 *
 * @throws {Error} Logs any error that occurs while trying to enable Bluetooth.
 */
const enableBluetooth = async (): Promise<void> => {
  try {
    await BleManager.enableBluetooth();
  } catch (error) {
    console.error("[enableBluetooth] thrown", error);
  }
};

/**
 * Initializes Bluetooth Low Energy (BLE) functionality.
 *
 * This asynchronous function performs three main tasks:
 * 1. Starts the BleManager without showing an alert.
 * 2. Handles Android-specific BLE permissions.
 * 3. Enables Bluetooth on the device.
 *
 * It should be called before any other BLE operations are performed.
 *
 * @returns {Promise<void>} A promise that resolves when BLE initialization is complete.
 *
 * @throws {Error} May throw an error if BleManager fails to start or if Bluetooth cannot be enabled.
 */
export const initBle = async (): Promise<void> => {
  await BleManager.start({ showAlert: false });
  handleAndroidPermissions();
  await enableBluetooth();
};

/**
 * Initiates a Bluetooth Low Energy (BLE) scan for peripheral devices.
 *
 * This function uses the BleManager to scan for BLE devices with specific service UUIDs.
 * It configures the scan with predefined parameters for duration and duplicate filtering.
 * The scan is set to use a sticky match mode, low latency scan mode, and reports all matches.
 *
 * @throws {Error} If there's an error during the BLE scan process, it will be caught and logged.
 *
 * @returns {void} This function doesn't return a value, but initiates a BLE scan process.
 */
export const scanForPeripherals = (): void => {
  try {
    BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
      matchMode: BleScanMatchMode.Sticky,
      scanMode: BleScanMode.LowLatency,
      callbackType: BleScanCallbackType.AllMatches,
    })
      .then(() => {
        console.log("scanning... .");
      })
      .catch((err: any) => {
        console.error("[scan] ble scan returned in error" + err);
      });
  } catch (error) {
    console.error("[scan] ble scan error thrown" + error);
  }
};
