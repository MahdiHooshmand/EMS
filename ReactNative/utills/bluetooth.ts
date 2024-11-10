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
import {
  ConnectionStatus,
  PeripheralModel,
} from "../models/peripheralCardModel";
import { MutableRefObject } from "react";

declare module "react-native-ble-manager" {
  interface Peripheral {
    info: PeripheralModel;
  }
}

let _peripheralsRef: MutableRefObject<PeripheralModel[]>;
let _setPeripherals: (value: PeripheralModel[]) => void;
let _isScanning: boolean = false;
let _setIsScanning: (value: boolean) => void;

const BleManagerModule = NativeModules.BleManager;
export const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export let listeners: any[] = [];

//
const setListeners = () => {
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

//
const handleAndroidPermissions = () => {
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

//
const enableBluetooth = async () => {
  try {
    await BleManager.enableBluetooth();
  } catch (error) {
    console.error("[enableBluetooth] thrown", error);
  }
};

//
interface initBleProps {
  peripheralsRef: MutableRefObject<PeripheralModel[]>;
  setPeripherals: (value: PeripheralModel[]) => void;
  isScanning: boolean;
  setIsScanning: (value: boolean) => void;
}

//
export const initBle = async ({
  peripheralsRef,
  setPeripherals,
  isScanning,
  setIsScanning,
}: initBleProps) => {
  await BleManager.start({ showAlert: false });
  handleAndroidPermissions();
  await enableBluetooth();
  _peripheralsRef = peripheralsRef;
  _setPeripherals = setPeripherals;
  _isScanning = isScanning;
  _setIsScanning = setIsScanning;
  setListeners();
};

//
export const scanForPeripherals = () => {
  if (!_isScanning) {
    console.log("start Scanning.");
    _setIsScanning(true);
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

export const connectPeripheral = async (peripheral: PeripheralModel) => {
  await stopScan();
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
  let foundingAuthService = true;
  while (foundingAuthService) {
    let tempData = await BleManager.retrieveServices(peripheral.id);
    const services = tempData.services;
    if (services) {
      for (let i = 0; i < services.length; i++) {
        if (services[i].uuid === "1010") {
          console.log("Found Auth service");
          foundingAuthService = false;
          break;
        }
      }
    }
  }
  const username = Array.from(new TextEncoder().encode("Admin"));
  await BleManager.write(peripheral.id, "1010", "1011", username);
  const password = Array.from(new TextEncoder().encode("admin"));
  await BleManager.write(peripheral.id, "1010", "1012", password);
};

export const stopScan = async () => {
  await BleManager.stopScan();
  _setIsScanning(false);
};
