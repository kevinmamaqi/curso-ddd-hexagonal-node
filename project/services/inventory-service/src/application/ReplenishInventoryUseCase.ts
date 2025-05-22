import { Quantity } from "../domain/value-objects/Quantity";
import { ProductInventoryPort } from "../domain/ports/ProductInventoryRepositoryPort";
import { ProductInventoryEventsPort } from "../domain/ports/ProductInventoryEventsPort";

export class ReplenishInventoryUseCase {
  constructor(
    private readonly inventoryRepo: ProductInventoryPort,
    private readonly productInventoryEvents: ProductInventoryEventsPort
  ) {}

  async exec(sku: string, qty: number): Promise<void> {
    const inventory = await this.inventoryRepo.getBySku(sku);
    if (!inventory) {
      throw new Error("Product not found");
    }

    const qtyObj = Quantity.of(qty);

    inventory.replenish(qtyObj);
    await this.inventoryRepo.save(inventory);
    await this.productInventoryEvents.emitProductInventoryReplenished(
      inventory.sku,
      qtyObj
    );
  }
}
