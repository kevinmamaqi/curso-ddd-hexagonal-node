import { Quantity } from "../value-objects/Quantity";
import { SKU } from "../value-objects/SKU";

export type MovementType = "CREATED" | "RESERVE" | "RELEASE" | "REPLENISH";

export class ProductInventory {
  readonly sku: SKU;
  private available: number;
  private lastMovementType: MovementType;
  private lastQuantity: number = 0;
  private version: Date;

  constructor(sku: SKU, available: number, version: Date = new Date()) {
    if (available < 0)
      throw new Error("Available shoud be equal or higher than 0.");

    this.sku = sku;
    this.available = available;
    this.version = version;
    this.lastMovementType = "CREATED";
    this.lastQuantity = available;
  }

  reserve(qty: Quantity) {
    const qtyNumber = qty.toNumber();
    if (this.available < qtyNumber)
      throw new Error("Insufficient product stock");
    this.available -= qtyNumber;
    this.lastMovementType = "RESERVE";
    this.lastQuantity = qtyNumber;
  }

  release(qty: Quantity): void {
    const qtyNumber = qty.toNumber();
    this.available += qtyNumber;
    this.lastMovementType = "RELEASE";
    this.lastQuantity = qtyNumber;
  }

  replenish(qty: Quantity): void {
    this.available += qty.toNumber();
    this.lastMovementType = "REPLENISH";
    this.lastQuantity = qty.toNumber();
  }

  getAvailable(): number {
    return this.available;
  }

  getLastMovementType(): MovementType {
    return this.lastMovementType;
  }

  getLastQuantity(): number {
    return this.lastQuantity;
  }

  getVersion(): Date {
    return this.version;
  }
}
