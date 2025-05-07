import { PrismaClient } from "@prisma/client";
import { ProductInventory } from "../../domain/model/ProductInventoryModel";
import { ProductInventoryPort } from "../../domain/ports/ProductInventoryPort";

export class ProductInventoryAdapter implements ProductInventoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async save(inventory: ProductInventory): Promise<void> {
    await this.prisma.inventory.upsert({
      where: { sku: inventory.sku },
      update: { available: inventory.getAvailable() },
      create: { sku: inventory.sku, available: inventory.getAvailable() },
    });
  }

  async getBySku(sku: string): Promise<ProductInventory | null> {
    const row = await this.prisma.inventory.findUnique({ where: { sku } });
    return row ? new ProductInventory(row.sku, row.available) : null;
  }
}
