import { Quantity } from "../value-objects/Quantity";
import { SKU } from "../value-objects/SKU";

export class ProductInventory {
  private reserved: number = 0;
  private readonly restockThreshold: number = 10;
  readonly sku: SKU;
  private available: number;

  constructor(sku: SKU, available: number) {
    if (available < 0)
      throw new Error("Available shoud be equal or higher than 0.");

    this.sku = sku;
    this.available = available;
  }

  reserve(qty: Quantity) {
    const qtyNumber = qty.toNumber();
    if (this.available < qtyNumber)
      throw new Error("Insufficient product stock");
    this.available -= qtyNumber;
    this.reserved += qtyNumber;

    if (this.isRestockThresholdReached()) this.emitRestockEvent();
  }

  release(qty: Quantity): void {
    const qtyNumber = qty.toNumber();
    if (this.reserved < qtyNumber)
      throw new Error("Insufficient product reserved");
    this.reserved -= qtyNumber;
    this.available += qtyNumber;
  }

  replenish(qty: Quantity): void {
    this.available += qty.toNumber();
  }

  private isRestockThresholdReached(): boolean {
    return this.available <= this.restockThreshold;
  }

  private emitRestockEvent(): void {
    console.log(`Restock event emitted for ${this.sku.toString()}`);
  }

  getAvailable(): number {
    return this.available;
  }
}
