export class Quantity {
  private constructor(private readonly value: number) {}

  static of(value: number) {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error("La cantidad debe ser un número entero positivo.");
    }

    return new Quantity(value);
  }

  toNumber(): number {
    return this.value;
  }
}
