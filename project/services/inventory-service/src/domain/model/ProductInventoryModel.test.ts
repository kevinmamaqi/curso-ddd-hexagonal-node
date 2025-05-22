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
  let consoleSpy: vi.SpyInstance;

  beforeEach(() => {
    inventory = new ProductInventory(sku, 10);
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
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
