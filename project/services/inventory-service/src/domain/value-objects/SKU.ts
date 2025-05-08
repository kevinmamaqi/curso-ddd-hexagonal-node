export class SKU {
  private static readonly SKU_REGEX = /^[A-Z]{3}-[0-9]{4}-[A-Z]{2}$/;

  private constructor(private readonly value: string) {}

  static of(value: string) {
    if (!SKU.SKU_REGEX.test(value)) {
      throw new Error("El SKU debe tener el formato 'AAA-0000-AA'.");
    }
    return new SKU(value);
  }

  toString(): string {
    return this.value;
  }
}
