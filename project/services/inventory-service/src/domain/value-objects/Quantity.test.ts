import { Quantity } from "./Quantity";

describe("Quantity", () => {
  const validQuantities = [1, 10, 100];
  const invalidQuantities = [0, -1, 1.5];

  it("should create a valid quantity", () => {
    validQuantities.forEach((qty) => {
      expect(() => Quantity.of(qty)).not.toThrow();
    });
  });

  it("should throw an error for invalid quantities", () => {
    invalidQuantities.forEach((qty) => {
      expect(() => Quantity.of(qty)).toThrow();
    });
  });
});
