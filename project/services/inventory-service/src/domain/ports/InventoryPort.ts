import { ProductInventory } from "../model/InventoryModel";

export default interface InventoryPort {
  save(inventory: ProductInventory): Promise<void>;
  getBySku(sku: string): Promise<ProductInventory | null>;
}
