import { Quantity } from "../domain/value-objects/Quantity";
import { ProductInventoryPort } from "../domain/ports/ProductInventoryRepositoryPort";
import { ProductInventoryEventsPort } from "../domain/ports/ProductInventoryEventsPort";
import { ProductInventory } from "../domain/model/ProductInventoryModel";
import { SKU } from "../domain/value-objects/SKU";

export class CreateInventoryUseCase {
  constructor(
    private readonly inventoryRepo: ProductInventoryPort,
    private readonly productInventoryEvents: ProductInventoryEventsPort
  ) {}

  async exec(sku: string, qty: number): Promise<void> {
    const existingInventory = await this.inventoryRepo.getBySku(sku);

    if (existingInventory) {
      throw new Error("Product inventory already exists");
    }

    const inventory = new ProductInventory(SKU.of(sku), qty);

    await this.inventoryRepo.save(inventory);
    await this.productInventoryEvents.emitProductInventoryCreated(
      inventory.sku,
      Quantity.of(qty)
    );
  }
}
