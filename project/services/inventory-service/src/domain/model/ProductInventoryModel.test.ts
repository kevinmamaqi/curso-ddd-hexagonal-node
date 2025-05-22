import { ProductInventory } from "./ProductInventoryModel";
import { Quantity } from "../value-objects/Quantity";
import { SKU } from "../value-objects/SKU";

describe("ProductInventoryModel constructor", () => {
  it("should create a product inventory with valid values", () => {
    const i = new ProductInventory(SKU.of("ABC-1234-AB"), 10);
    expect(i.sku.toString()).toBe("ABC-1234-AB");
    expect(i.getAvailable()).toBe(10);
  });

  it("should throw an error with invalid arguments", () => {
    expect(() => new ProductInventory(SKU.of("ABC-1234-AB"), -10)).toThrow(
      "Available shoud be equal or higher than 0."
    );
  });
});

describe("ProductInventoryModel movements", () => {
  let inventory: ProductInventory;

  beforeEach(() => {
    inventory = new ProductInventory(SKU.of("ABC-1234-AB"), 10);
  });

  describe("reserve", () => {
    it("should decrease available quantity when a reserve happens", () => {
      inventory.reserve(Quantity.of(5));
      expect(inventory.getAvailable()).toBe(5);
      expect(inventory.getLastMovementType()).toBe("RESERVE");
      expect(inventory.getLastQuantity()).toBe(5);
    });

    it("should throw an error with negative qty", () => {
      expect(() => inventory.reserve(Quantity.of(-1))).toThrow(
        "La cantidad debe ser un número entero positivo."
      );
    });

    it("should throw an error with insufficient stock", () => {
      expect(() => inventory.reserve(Quantity.of(11))).toThrow(
        "Insufficient product stock"
      );
    });
  });

  describe("release", () => {
    it("should increase available quantity when a release happens", () => {
      inventory.release(Quantity.of(5));
      expect(inventory.getAvailable()).toBe(15);
      expect(inventory.getLastMovementType()).toBe("RELEASE");
      expect(inventory.getLastQuantity()).toBe(5);
    });

    it("should throw an error with negative qty", () => {
      expect(() => inventory.release(Quantity.of(-1))).toThrow(
        "La cantidad debe ser un número entero positivo."
      );
    });
  });

  describe("replenish", () => {
    it("should increase available quantity when a replenish happens", () => {
      inventory.replenish(Quantity.of(5));
      expect(inventory.getAvailable()).toBe(15);
      expect(inventory.getLastMovementType()).toBe("REPLENISH");
      expect(inventory.getLastQuantity()).toBe(5);
    });

    it("should throw an error with negative qty", () => {
      expect(() => inventory.replenish(Quantity.of(-1))).toThrow(
        "La cantidad debe ser un número entero positivo."
      );
    });
  });
});
