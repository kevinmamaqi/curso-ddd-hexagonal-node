// representa el inventario de un producto
export class ProductInventory {
  readonly sku: string; // sku de un producto
  private available: number;

  constructor(sku: string, available: number) {
    if (available < 0)
      throw new Error("Available shoud be equal or higher than 0.");

    this.sku = sku;
    this.available = available;
  }

  reserve(qty: number) {
    if (qty < 0) throw new Error("Quantity must be positive.");
    if (this.available < qty) throw new Error("Insifficient product stock");
    this.available -= qty;
  }

  getAvailable(): number {
    return this.available;
  }
}
