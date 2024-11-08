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
  const p = new PeripheralModel(
    peripheral.name,
    peripheral.rssi,
    ConnectionStatus.READY_TO_CONNECT,
    peripheral.id,
    peripheral,
  );
  _peripheralsRef.current = [..._peripheralsRef.current, p];
};

const onStopScan = () => {
  console.log("scanning finished.");
  _setIsScanning(false);
};

const onDisconnectedPeripheral = (event: BleDisconnectPeripheralEvent) => {
  for (let p in _peripheralsRef.current) {
    if (_peripheralsRef.current[p].id === event.peripheral) {
      _peripheralsRef.current[p].connection = ConnectionStatus.READY_TO_CONNECT;
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
  isScanning: boolean;
  setIsScanning: (value: boolean) => void;
}

//
export const initBle = async ({
  peripheralsRef,
  isScanning,
  setIsScanning,
}: initBleProps) => {
  await BleManager.start({ showAlert: false });
  handleAndroidPermissions();
  await enableBluetooth();
  _peripheralsRef = peripheralsRef;
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
