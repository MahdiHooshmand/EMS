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
  console.log("new peripheral.");
  console.log(peripheral.id);
  if (!peripheral.name) {
    peripheral.name = "NO NAME";
  }
  console.log(peripheral.name);

  for (let pi in _peripheralsRef.current) {
    if (_peripheralsRef.current[pi].id === peripheral.id) {
      return;
    }
  }
  const p = new PeripheralModel(
    peripheral.name,
    peripheral.rssi,
    ConnectionStatus.READY_TO_CONNECT,
    peripheral.id,
    peripheral,
  );
  console.log("Adding peripheral to list.");
  _peripheralsRef.current = [..._peripheralsRef.current, p];
  _setPeripherals([..._peripheralsRef.current]);
  console.log("emitting new peripheral.");
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

export const connectPeripheralWithAuthenticate = async (
  peripheral: PeripheralModel,
) => {
  await BleManager.stopScan();
  _setIsScanning(false);
  const connectedPeripherals = await BleManager.getConnectedPeripherals();
  if (connectedPeripherals.length > 0) {
    connectedPeripherals.map(async (item) => {
      await BleManager.disconnect(item.id);
    });
  }
  updatePeripheralConnectionStatus(peripheral.id, ConnectionStatus.CONNECTING);
  let tempTryCount = 0;
  while (peripheral.connection === ConnectionStatus.CONNECTING) {
    try {
      await BleManager.connect(peripheral.id);
      updatePeripheralConnectionStatus(
        peripheral.id,
        ConnectionStatus.VERIFYING,
      );
      await sleep(2000);
      const quality = await BleManager.readRSSI(peripheral.id);
      updatePeripheralQuality(peripheral.id, quality);
      console.debug(
        `[connectPeripheral][${peripheral.id}] retrieved current RSSI value: ${peripheral.quality}.`,
      );
      updatePeripheralConnectionStatus(
        peripheral.id,
        ConnectionStatus.VERIFYING,
      );
    } catch (error) {
      console.error(
        `[connectPeripheral][${peripheral.id}] connectPeripheral error`,
        error,
        ".trying again.",
      );
      tempTryCount = tempTryCount + 1;
      if (tempTryCount === 4) {
        console.error(
          `[connectPeripheral][${peripheral.id}] connectPeripheral error`,
          error,
          ".trying again.",
        );
        updatePeripheralConnectionStatus(
          peripheral.id,
          ConnectionStatus.READY_TO_CONNECT,
        );
        return;
      }
    }
  }
  console.log("sending username and password to peripheral.");
  let authServiceFounded = false;
  while (!authServiceFounded) {
    let tempData = await BleManager.retrieveServices(peripheral.id);
    const services = tempData.services;
    if (services) {
      authServiceFounded = services.some((service) => service.uuid === "1010");
      if (authServiceFounded) {
        console.log(`Found Auth service: ${JSON.stringify(tempData)}`);
      } else {
        console.log(`Auth service not found${JSON.stringify(tempData)}`);
        await sleep(500);
      }
    }
  }
  const username = Array.from(new TextEncoder().encode("Admin"));
  await BleManager.write(peripheral.id, "1010", "1011", username);
  const password = Array.from(new TextEncoder().encode("admin"));
  await BleManager.write(peripheral.id, "1010", "1012", password);
  let token = "";
  while (token.length < 10) {
    try {
      const tokenData = await BleManager.read(peripheral.id, "1010", "1013");
      token = String.fromCharCode(...tokenData);
      console.log("Received Token:", token);
    } catch (error) {
      console.error("Error reading token:", error);
    }
  }
  const response = Array.from(new TextEncoder().encode("OK"));
  await BleManager.write(peripheral.id, "1010", "1014", response);
};
