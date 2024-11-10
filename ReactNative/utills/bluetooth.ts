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

const BleManagerModule = NativeModules.BleManager;
export const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export let listeners: any[] = [];

interface setListenersParams {
  onDiscoverPeripheral: (peripheral: Peripheral) => void;
  onStopScan: () => void;
  onDisconnectedPeripheral: (event: BleDisconnectPeripheralEvent) => void;
}

export const setListeners = ({
  onDiscoverPeripheral,
  onStopScan,
  onDisconnectedPeripheral,
}: setListenersParams) => {
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

const enableBluetooth = async () => {
  try {
    await BleManager.enableBluetooth();
  } catch (error) {
    console.error("[enableBluetooth] thrown", error);
  }
};

export const initBle = async () => {
  await BleManager.start({ showAlert: false });
  handleAndroidPermissions();
  await enableBluetooth();
};

export const scanForPeripherals = () => {
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
