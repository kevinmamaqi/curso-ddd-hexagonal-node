import { Quantity } from "../value-objects/Quantity";
import { SKU } from "../value-objects/SKU";
import { ProductInventory } from "./ProductInventoryModel";

describe("ProductInventoryModel constructor", () => {
  it("should create a product inventory with valid values", () => {
    const sku = SKU.of("AAA-1234-BB");
    const i = new ProductInventory(sku, 10);
    expect(i.sku.toString()).toBe("AAA-1234-BB");
    expect(i.getAvailable()).toBe(10);
  });

  it("should throw an error with invalid arguments", () => {
    const sku = SKU.of("AAA-1234-BB");
    expect(() => new ProductInventory(sku, -10)).toThrow(
      "Available shoud be equal or higher than 0."
    );
  });
});

describe("ProductInventoryModel reserve", () => {
  let inventory: ProductInventory;
  const sku = SKU.of("AAA-1234-BB");

  beforeEach(() => {
    inventory = new ProductInventory(sku, 10);
  });

  it("should decrease available quantity when a reserve happens", () => {
    const qty = Quantity.of(5);
    inventory.reserve(qty);
    expect(inventory.getAvailable()).toBe(5);
  });


  it("should decrease available quantity when a reserve happens", () => {
    const qty = Quantity.of(11);
    expect(() => inventory.reserve(qty)).toThrow("Insufficient product stock");
  });
});

describe("restock event emission on reserve", () => {
  let inventory: ProductInventory;
  const sku = SKU.of("AAA-1234-BB");
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    inventory = new ProductInventory(sku, 10);
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("should emit restock event if available quantity after reservation is less than threshold", () => {
    const quantityToReserve = Quantity.of(1);
    inventory.reserve(quantityToReserve); // `inventory` is from the outer scope's beforeEach

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      `Restock event emitted for ${sku.toString()}`
    );
  });

  it("should emit restock event if available quantity after reservation is equal to threshold", () => {
    const localInventory = new ProductInventory(sku, 11);
    const quantityToReserve = Quantity.of(1);
    localInventory.reserve(quantityToReserve);

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      `Restock event emitted for ${sku.toString()}`
    );
  });

  it("should not emit restock event if available quantity after reservation is greater than threshold", () => {
    const localInventory = new ProductInventory(sku, 12);
    const quantityToReserve = Quantity.of(1);
    localInventory.reserve(quantityToReserve);

    expect(consoleSpy).not.toHaveBeenCalled();
  });
});
