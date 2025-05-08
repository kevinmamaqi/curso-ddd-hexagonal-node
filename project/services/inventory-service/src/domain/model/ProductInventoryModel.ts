import { Quantity } from "../value-objects/Quantity";
import { SKU } from "../value-objects/SKU";

export class ProductInventory {
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
      throw new Error("Insifficient product stock");
    this.available -= qtyNumber;
  }

  getAvailable(): number {
    return this.available;
  }
}
