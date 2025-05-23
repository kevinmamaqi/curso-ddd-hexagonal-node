import { InventoryProduct } from "../types/inventory";

export interface InventoryServicePort {
  get(sku: string): Promise<InventoryProduct>;
}
