import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ProductInventory } from "../../domain/model/ProductInventoryModel";
import { SKU } from "../../domain/value-objects/SKU";
import { ProductInventoryPort } from "../../domain/ports/ProductInventoryRepositoryPort";

export class ProductInventoryAdapter implements ProductInventoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async getBySku(sku: string): Promise<ProductInventory | null> {
    const row = await this.prisma.inventory.findUnique({ where: { sku } });
    return row
      ? new ProductInventory(SKU.of(sku), row.available, row.updatedAt)
      : null;
  }

  async save(inventory: ProductInventory): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        await this.createMovement(tx, inventory);
        await this.saveInventory(tx, inventory);
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "Concurrent modification detected. Please retry the operation."
      ) {
        throw error;
      }
      throw new Error(
        "Failed to save inventory: " +
          (error instanceof Error ? error.message : String(error))
      );
    }
  }

  private async createMovement(
    tx: Prisma.TransactionClient,
    inventory: ProductInventory
  ): Promise<void> {
    await tx.movement.create({
      data: {
        sku: inventory.sku.toString(),
        movementType: inventory.getLastMovementType(),
        qty: inventory.getLastQuantity(),
      },
    });
  }

  private async saveInventory(
    tx: Prisma.TransactionClient,
    inventory: ProductInventory
  ): Promise<void> {
    const existing = await this.findInventoryBySku(
      tx,
      inventory.sku.toString()
    );

    if (!existing) {
      await this.createInventory(tx, inventory);
    } else {
      await this.updateInventory(tx, inventory);
    }
  }

  private async findInventoryBySku(
    tx: Prisma.TransactionClient,
    sku: string
  ): Promise<{ available: number; updatedAt: Date } | null> {
    return tx.inventory.findUnique({
      where: { sku },
      select: { available: true, updatedAt: true },
    });
  }

  private async createInventory(
    tx: Prisma.TransactionClient,
    inventory: ProductInventory
  ): Promise<void> {
    await tx.inventory.create({
      data: {
        sku: inventory.sku.toString(),
        available: inventory.getAvailable(),
      },
    });
  }

  private async updateInventory(
    tx: Prisma.TransactionClient,
    inventory: ProductInventory
  ): Promise<void> {
    try {
      await tx.inventory.update({
        where: {
          sku: inventory.sku.toString(),
          updatedAt: inventory.getVersion(),
        },
        data: {
          available: inventory.getAvailable(),
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new Error(
          "Concurrent modification detected. Please retry the operation."
        );
      }
      throw error;
    }
  }
}
