export class PeripheralModel {
  public readonly name: string;
  public readonly quality: number;
  public readonly isValid: boolean;
  public readonly connection: number;

  constructor(name: string, quality: number, connection: number) {
    this.name = name;
    this.quality = quality;
    this.isValid = this.name.startsWith("Febina EMS");
    this.connection = connection;
  }
}

export const FakePeripheralModel = () => {
  const connections = [1, 2, 3, 0, 1, 2, 3, 1, 2, 3];
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
