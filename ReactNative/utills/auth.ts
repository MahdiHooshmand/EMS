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

let _peripheralsRef: MutableRefObject<PeripheralModel[]>;
let _setPeripherals: (value: PeripheralModel[]) => void;
let _isScanning: boolean = false;
let _setIsScanning: (value: boolean) => void;

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

export const scanForPeripherals = () => {
  if (!_isScanning) {
    console.log("Starting scan...");
    _setIsScanning(true);
    Bluetooth.scanForPeripherals();
  }
};

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

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

const updatePeripheralQuality = (peripheralId: string, quality: number) => {
  for (let p in _peripheralsRef.current) {
    if (_peripheralsRef.current[p].id === peripheralId) {
      _peripheralsRef.current[p].quality = quality;
      _setPeripherals([..._peripheralsRef.current]);
      break;
    }
  }
};

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

const authenticateDevice = async (
  peripheral: PeripheralModel,
  user: string,
  pass: string,
) => {
  let authServiceFound = false;
  while (!authServiceFound) {
    const servicesData = await BleManager.retrieveServices(peripheral.id);
    if (servicesData.services) {
      authServiceFound = servicesData.services.some(
        (service) => service.uuid === "1010",
      );
    } else {
      authServiceFound = false;
    }
    if (!authServiceFound) await sleep(500);
  }

  console.log("Auth service found. Sending credentials...");
  await BleManager.write(
    peripheral.id,
    "1010",
    "1011",
    Array.from(new TextEncoder().encode(user)),
  );
  await BleManager.write(
    peripheral.id,
    "1010",
    "1012",
    Array.from(new TextEncoder().encode(pass)),
  );

  let token = "";
  while (token.length < 10) {
    try {
      const tokenData = await BleManager.read(peripheral.id, "1010", "1013");
      token = String.fromCharCode(...tokenData);
    } catch (error) {
      console.error("Error reading token:", error);
    }
  }
  peripheral.token = token;

  await BleManager.write(
    peripheral.id,
    "1010",
    "1014",
    Array.from(new TextEncoder().encode("OK")),
  );
  updatePeripheralConnectionStatus(peripheral.id, ConnectionStatus.CONNECTED);
};

export const connectPeripheralWithAuthenticate = async (
  peripheral: PeripheralModel,
  user: string,
  pass: string,
) => {
  await BleManager.stopScan();
  _setIsScanning(false);

  const connectedPeripherals = await BleManager.getConnectedPeripherals();
  for (const connectedPeripheral of connectedPeripherals) {
    await BleManager.disconnect(connectedPeripheral.id);
  }

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
