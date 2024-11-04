/**
 * Represents a peripheral device model with various properties.
 */
export class PeripheralModel {
  /** The name of the peripheral device. */
  public readonly name: string;

  /** The quality of the peripheral device's signal or performance. */
  public readonly quality: number;

  /** Indicates whether the peripheral device is valid (starts with "Febina EMS"). */
  public readonly isValid: boolean;

  /** The connection status or strength of the peripheral device. */
  public readonly connection: number;

  /**
   * Creates a new instance of the PeripheralModel.
   * @param name - The name of the peripheral device.
   * @param quality - The quality of the peripheral device's signal or performance.
   * @param connection - The connection status or strength of the peripheral device.
   */
  constructor(name: string, quality: number, connection: number) {
    this.name = name;
    this.quality = quality;
    this.isValid = this.name.startsWith("Febina EMS");
    this.connection = connection;
  }
}

/**
 * A mock function for creating fake peripheral devices.
 * @returns An array of fake peripheral devices.
 */
export const FakePeripheralModel = () => {
  const connections = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const newDevices: PeripheralModel[] = connections.map((connection, index) => {
    return new PeripheralModel(
      `Febina EMS 2502${index + 4}`,
      -50 + index * 10,
      connection,
    );
  });

  newDevices.push(new PeripheralModel("hands free", -153, 0));
  return newDevices;
};
