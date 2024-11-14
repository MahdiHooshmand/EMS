import { MutableRefObject } from "react";
import {
  ConnectionStatus,
  PeripheralModel,
} from "../models/peripheralCardModel";
import BleManager, {
  BleDisconnectPeripheralEvent,
  Peripheral,
} from "react-native-ble-manager";
import * as Bluetooth from "./bluetooth";
import {
  AUTH_SERVICE_UUID,
  PASSWORD_CHARACTERISTIC_UUID,
  RESPONSE_CHARACTERISTIC_UUID,
  TOKEN_CHARACTERISTIC_UUID,
  USERNAME_CHARACTERISTIC_UUID,
} from "../assets/thems/ble_services";

/**
 * Updates the internal state references for peripherals and scanning status.
 *
 * @param peripheralsRef - A mutable reference object that holds an array of PeripheralModel instances.
 * @param setPeripherals - A function to update the list of peripherals.
 * @param isScanning - A boolean indicating whether a scan is currently in progress.
 * @param setIsScanning - A function to update the scanning status.
 */
let _peripheralsRef: MutableRefObject<PeripheralModel[]>;
let _setPeripherals: (value: PeripheralModel[]) => void;
let _isScanning: boolean = false;
let _setIsScanning: (value: boolean) => void;

/**
 * Handles the discovery of a new Bluetooth peripheral device.
 *
 * This function is triggered when a new peripheral is detected during a Bluetooth scan.
 * It checks if the peripheral is already known and, if not, adds it to the list of peripherals.
 *
 * @param peripheral - The peripheral object representing the newly discovered Bluetooth device.
 *   - `id`: A unique identifier for the peripheral.
 *   - `name`: The name of the peripheral. If not provided, defaults to "NO NAME".
 *   - `rssi`: The signal strength of the peripheral.
 */
const onDiscoverPeripheral = (peripheral: Peripheral) => {
  console.log("new peripheral detected:", peripheral.id);

  if (!peripheral.name) {
    peripheral.name = "NO NAME";
  }

  if (_peripheralsRef.current.some((p) => p.id === peripheral.id)) {
    return;
  }

  const newPeripheral = new PeripheralModel(
    peripheral.name,
    peripheral.rssi,
    ConnectionStatus.READY_TO_CONNECT,
    peripheral.id,
    peripheral,
  );
  _peripheralsRef.current = [..._peripheralsRef.current, newPeripheral];
  _setPeripherals([..._peripheralsRef.current]);
};

/**
 * Handles the event when a Bluetooth scan is stopped.
 *
 * This function logs a message indicating that the scanning process has finished
 * and updates the scanning status to false.
 */
const onStopScan = () => {
  console.log("Scanning finished.");
  _setIsScanning(false);
};

const onDisconnectedPeripheral = (event: BleDisconnectPeripheralEvent) => {
  for (let p in _peripheralsRef.current) {
    if (_peripheralsRef.current[p].id === event.peripheral) {
      _peripheralsRef.current[p].connection = ConnectionStatus.READY_TO_CONNECT;
      _setPeripherals([..._peripheralsRef.current]);
      break;
    }
  }
};

interface InitAuthProps {
  peripheralsRef: MutableRefObject<PeripheralModel[]>;
  setPeripherals: (value: PeripheralModel[]) => void;
  isScanning: boolean;
  setIsScanning: (value: boolean) => void;
}

/**
 * Initializes the authentication process by setting up necessary references and listeners.
 *
 * @param peripheralsRef - A mutable reference object that holds an array of PeripheralModel instances.
 * @param setPeripherals - A function to update the list of peripherals.
 * @param isScanning - A boolean indicating whether a scan is currently in progress.
 * @param setIsScanning - A function to update the scanning status.
 */
export const initAuth = async ({
  peripheralsRef,
  setPeripherals,
  isScanning,
  setIsScanning,
}: InitAuthProps) => {
  await Bluetooth.initBle();
  _peripheralsRef = peripheralsRef;
  _setPeripherals = setPeripherals;
  _isScanning = isScanning;
  _setIsScanning = setIsScanning;

  Bluetooth.setListeners({
    onDiscoverPeripheral,
    onStopScan,
    onDisconnectedPeripheral,
  });
};

/**
 * Initiates a scan for Bluetooth peripherals if not already scanning.
 *
 * This function checks the scanning status, and if not already scanning,
 * it logs a message, updates the scanning status, and initiates the scan for peripherals.
 */
export const scanForPeripherals = () => {
  if (!_isScanning) {
    console.log("Starting scan...");
    _setIsScanning(true);
    Bluetooth.scanForPeripherals();
  }
};

/**
 * Pauses the execution of the function for a specified number of milliseconds.
 *
 * This is an asynchronous function that returns a promise that resolves after the specified delay.
 * This allows for non-blocking pauses in asynchronous code, such as in a loop or after an API call.
 *
 * @param ms - The number of milliseconds to pause the execution of the function.
 *
 * @returns A promise that resolves after the specified delay.
 */
const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Updates the connection status of a specific peripheral device.
 *
 * This function iterates through the list of peripherals maintained in a React ref
 * and updates the connection status of the peripheral that matches the provided ID.
 * It then triggers a state update to reflect the change in the UI.
 *
 * @param peripheralId - The unique identifier of the peripheral device.
 * @param connectionStatus - The new connection status to be assigned to the peripheral.
 */
const updatePeripheralConnectionStatus = (
  peripheralId: string,
  connectionStatus: ConnectionStatus,
) => {
  for (let p in _peripheralsRef.current) {
    if (_peripheralsRef.current[p].id === peripheralId) {
      _peripheralsRef.current[p].connection = connectionStatus;
      _setPeripherals([..._peripheralsRef.current]);
      break;
    }
  }
};

/**
 * Updates the quality of a specific peripheral device.
 *
 * This function iterates through the list of peripherals maintained in a React ref
 * and updates the quality of the peripheral that matches the provided ID.
 * It then triggers a state update to reflect the change in the UI.
 *
 * @param peripheralId - The unique identifier of the peripheral device.
 * @param quality - The new quality value to be assigned to the peripheral.
 */
const updatePeripheralQuality = (peripheralId: string, quality: number) => {
  for (let p in _peripheralsRef.current) {
    if (_peripheralsRef.current[p].id === peripheralId) {
      _peripheralsRef.current[p].quality = quality;
      _setPeripherals([..._peripheralsRef.current]);
      break;
    }
  }
};

/**
 * Establishes a connection to a Bluetooth peripheral device and updates its connection status and quality.
 *
 * @param peripheralId - The unique identifier of the Bluetooth peripheral device to connect to.
 *
 * @returns A Promise that resolves when the connection is established, or it rejects if the connection fails.
 */
const connectDevice = async (peripheralId: string) => {
  try {
    await BleManager.connect(peripheralId);
    updatePeripheralConnectionStatus(peripheralId, ConnectionStatus.VERIFYING);
    const quality = await BleManager.readRSSI(peripheralId);
    updatePeripheralQuality(peripheralId, quality);
  } catch (error) {
    console.error(`Failed to connect to ${peripheralId}:`, error);
  }
};

/**
 * Authenticates a Bluetooth peripheral device using the provided credentials.
 *
 * This function attempts to establish a connection to the authentication service
 * on the specified Bluetooth peripheral. It sends the username and password
 * to the device and retrieves a token for authentication. The function also
 * updates the connection status of the peripheral to indicate successful authentication.
 *
 * @param peripheral - The Bluetooth peripheral device to authenticate.
 * @param user - The username for authentication.
 * @param pass - The password for authentication.
 */
const authenticateDevice = async (
  peripheral: PeripheralModel,
  user: string,
  pass: string,
) => {
  let authServiceFound = false;
  while (!authServiceFound) {
    console.log("Looking for auth service...");
    const servicesData = await BleManager.retrieveServices(peripheral.id);
    console.log("Services data:", servicesData);
    if (servicesData.services) {
      authServiceFound = servicesData.services.some(
        (service) => service.uuid === AUTH_SERVICE_UUID,
      );
    } else {
      authServiceFound = false;
    }
    if (!authServiceFound) await sleep(500);
  }

  console.log("Auth service found. Sending credentials...");
  await BleManager.write(
    peripheral.id,
    AUTH_SERVICE_UUID,
    USERNAME_CHARACTERISTIC_UUID,
    Array.from(new TextEncoder().encode(user)),
  );
  await BleManager.write(
    peripheral.id,
    AUTH_SERVICE_UUID,
    PASSWORD_CHARACTERISTIC_UUID,
    Array.from(new TextEncoder().encode(pass)),
  );

  let token = "";
  while (token.length < 10) {
    try {
      const tokenData = await BleManager.read(
        peripheral.id,
        AUTH_SERVICE_UUID,
        TOKEN_CHARACTERISTIC_UUID,
      );
      token = String.fromCharCode(...tokenData);
    } catch (error) {
      console.error("Error reading token:", error);
    }
  }
  peripheral.token = token;

  await BleManager.write(
    peripheral.id,
    AUTH_SERVICE_UUID,
    RESPONSE_CHARACTERISTIC_UUID,
    Array.from(new TextEncoder().encode("OK")),
  );
  updatePeripheralConnectionStatus(peripheral.id, ConnectionStatus.CONNECTED);
};

export const stopScanning = async () => {
  await BleManager.stopScan();
  _setIsScanning(false);
};

export const disconnectAll = async () => {
  const connectedPeripherals = await BleManager.getConnectedPeripherals();
  for (const connectedPeripheral of connectedPeripherals) {
    await BleManager.disconnect(connectedPeripheral.id);
  }
};

/**
 * Establishes a connection to a Bluetooth peripheral, authenticates it using the provided credentials,
 * and updates the peripheral's connection status and token.
 *
 * @param peripheral - The peripheral device to connect to and authenticate.
 * @param user - The username for authentication.
 * @param pass - The password for authentication.
 */
export const connectPeripheralWithAuthenticate = async (
  peripheral: PeripheralModel,
  user: string,
  pass: string,
) => {
  await stopScanning();

  await disconnectAll();

  updatePeripheralConnectionStatus(peripheral.id, ConnectionStatus.CONNECTING);

  let retries = 0;
  while (peripheral.connection === ConnectionStatus.CONNECTING && retries < 4) {
    await connectDevice(peripheral.id);
    retries++;
    if (peripheral.connection !== ConnectionStatus.CONNECTING) break;
    if (retries === 4) {
      updatePeripheralConnectionStatus(
        peripheral.id,
        ConnectionStatus.READY_TO_CONNECT,
      );
      return;
    }
  }

  await authenticateDevice(peripheral, user, pass);
};
