import { ProductInventory } from "../model/ProductInventoryModel";

export interface ProductInventoryPort {
  save(inventory: ProductInventory): Promise<void>;
  getBySku(sku: string): Promise<ProductInventory | null>;
}
