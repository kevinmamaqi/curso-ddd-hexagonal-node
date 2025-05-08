import { SKU } from "./SKU";

describe("SKU", () => {
  it("should create a valid SKU", () => {
    const validSKUs = ["AAA-0000-AA", "ABC-1234-AB", "XYZ-9999-XY"];

    const invalidSKUs = [
      "AAA-0000-A",
      "AAA-0000-AA-1",
      "AAA-000-AA",
      "AAA-00000-AA",
      "",
    ];

    validSKUs.forEach((sku) => {
      expect(() => SKU.of(sku)).not.toThrow();
    });

    invalidSKUs.forEach((sku) => {
      expect(() => SKU.of(sku)).toThrow();
    });
  });
});
