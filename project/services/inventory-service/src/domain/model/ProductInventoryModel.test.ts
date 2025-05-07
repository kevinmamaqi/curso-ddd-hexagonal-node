import { ProductInventory } from "./ProductInventoryModel";

describe("ProductInventoryModel constructor", () => {
  it("should create a product inventory with valid values", () => {
    const i = new ProductInventory("SKU-123", 10);
    expect(i.sku).toBe("SKU-123");
    expect(i.getAvailable()).toBe(10);
  });

  it("should throw an error with invalid arguments", () => {
    expect(() => new ProductInventory("SKU-456", -10)).toThrow(
      "Available shoud be equal or higher than 0."
    );
  });
});

describe("ProductInventoryModel reserve", () => {
  let inventory: ProductInventory;

  beforeEach(() => {
    inventory = new ProductInventory("SKU-123", 10);
  });

  it("should decrease available quantity when a reserve happens", () => {
    inventory.reserve(5);
    expect(inventory.getAvailable()).toBe(5);
  });

  it("should throw an error with negative qty", () => {
    expect(() => inventory.reserve(-1)).toThrow("Quantity must be positive.");
  });

  it("should decrease available quantity when a reserve happens", () => {
    expect(() => inventory.reserve(11)).toThrow("Insifficient product stock");
  });
});
