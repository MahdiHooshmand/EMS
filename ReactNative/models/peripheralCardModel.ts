import { Peripheral } from "react-native-ble-manager";

export enum ConnectionStatus {
  READY_TO_CONNECT = 1,
  CONNECTING = 2,
  VERIFYING = 3,
  CONNECTED = 4,
}

/**
 * Represents a peripheral device model with various properties.
 */
export class PeripheralModel {
  /** The name of the peripheral device. */
  public name: string;

  /** The quality of the peripheral device's signal or performance. */
  public quality: number;

  /** Indicates whether the peripheral device is valid (starts with "Febina EMS"). */
  public isValid: boolean;

  /** The connection status or strength of the peripheral device. */
  public connection: ConnectionStatus;

  /** A unique identifier for the peripheral device. */
  public id: string;

  /** The peripheral device object. */
  public peripheral: Peripheral;

  /** Indicates whether the peripheral device has been initialized. */

  /**
   * Creates a new instance of the PeripheralModel.
   * @param name - The name of the peripheral device.
   * @param quality - The quality of the peripheral device's signal or performance.
   * @param connection - The connection status or strength of the peripheral device.
   * @param id - The unique identifier for the peripheral device.
   * @param peripheral - The peripheral device object.
   */
  constructor(
    name: string,
    quality: number,
    connection: ConnectionStatus,
    id: string,
    peripheral: Peripheral,
  ) {
    this.name = name;
    this.quality = quality;
    this.isValid = name.startsWith("Febina EMS");
    this.connection = connection;
    this.id = id;
    this.peripheral = peripheral;
  }
}
