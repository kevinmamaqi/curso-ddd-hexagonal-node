import { ProductInventoryPort } from "../domain/ports/ProductInventoryPort";

export class ReserveInventoryUseCase {
  constructor(private readonly inventoryRepo: ProductInventoryPort) {}

  async exec(sku: string, qty: number): Promise<void> {
    const inventory = await this.inventoryRepo.getBySku(sku);
    if (!inventory) {
      throw new Error("Product not found");
    }

    inventory.reserve(qty);
    await this.inventoryRepo.save(inventory);
  }
}
