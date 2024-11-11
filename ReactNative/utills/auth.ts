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
  console.log("scanning finished.");
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

interface initAuthProps {
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
}: initAuthProps) => {
  await Bluetooth.initBle();
  _peripheralsRef = peripheralsRef;
  _setPeripherals = setPeripherals;
  _isScanning = isScanning;
  _setIsScanning = setIsScanning;
  Bluetooth.setListeners({
    onDiscoverPeripheral: onDiscoverPeripheral,
    onStopScan: onStopScan,
    onDisconnectedPeripheral: onDisconnectedPeripheral,
  });
};

export const scanForPeripherals = () => {
  if (!_isScanning) {
    console.log("start Scanning.");
    _setIsScanning(true);
    Bluetooth.scanForPeripherals();
  }
};

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

const updatePeripheralConnectionStatus = (
  peripheralId: string,
  connectionStatus: ConnectionStatus,
) => {
  for (let p in _peripheralsRef.current) {
    if (_peripheralsRef.current[p].id === peripheralId) {
      console.log(
        `updating connection status for peripheral: ${peripheralId} to ${connectionStatus}...  .`,
      );
      _peripheralsRef.current[p].connection = connectionStatus;
      break;
    }
  }
  _setPeripherals([..._peripheralsRef.current]);
};

const updatePeripheralQuality = (peripheralId: string, quality: number) => {
  for (let p in _peripheralsRef.current) {
    if (_peripheralsRef.current[p].id === peripheralId) {
      console.log(
        `updating quality for peripheral: ${peripheralId} to ${quality}...  .`,
      );
      _peripheralsRef.current[p].quality = quality;
      break;
    }
  }
  _setPeripherals([..._peripheralsRef.current]);
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

const authenticateDevice = async (peripheral: PeripheralModel) => {
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
    Array.from(new TextEncoder().encode("Admin")),
  );
  await BleManager.write(
    peripheral.id,
    "1010",
    "1012",
    Array.from(new TextEncoder().encode("admin")),
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

  await BleManager.write(
    peripheral.id,
    "1010",
    "1014",
    Array.from(new TextEncoder().encode("OK")),
  );
};

export const connectPeripheralWithAuthenticate = async (
  peripheral: PeripheralModel,
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

  await authenticateDevice(peripheral);
};
