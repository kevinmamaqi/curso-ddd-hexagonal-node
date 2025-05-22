import { PrismaClient } from "@prisma/client";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { execSync } from "child_process";
import { ProductInventoryAdapter } from "./ProductInventoryRepositoryAdapter";
import { ProductInventory } from "../../domain/model/ProductInventoryModel";
import { SKU } from "../../domain/value-objects/SKU";
import { Quantity } from "../../domain/value-objects/Quantity";
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";

describe("InventoryRepositoryPostgres", () => {
  let container: StartedPostgreSqlContainer;
  let prisma: PrismaClient;
  let repo: ProductInventoryAdapter;

  beforeAll(async () => {
    try {
      // Start PostgreSQL container
      container = await new PostgreSqlContainer()
        .withDatabase("inventory_test")
        .withUsername("test")
        .withPassword("test")
        .start();

      // Set DATABASE_URL for Prisma
      const connectionString = container.getConnectionUri();

      // Run migrations directly using Prisma CLI
      console.log("Running Prisma migrations...");
      execSync("npx prisma migrate deploy", {
        env: {
          ...process.env,
          DATABASE_URL: connectionString,
        },
        stdio: "inherit",
      });

      // Initialize Prisma client with test container connection
      process.env.DATABASE_URL = connectionString;
      prisma = new PrismaClient();
      console.log("Prisma client initialized");

      repo = new ProductInventoryAdapter(prisma);
    } catch (error) {
      console.error("Error in beforeAll:", error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      if (prisma) {
        await prisma.$disconnect();
      }
      if (container) {
        await container.stop();
      }
    } catch (error) {
      console.error("Error in afterAll:", error);
      throw error;
    }
  });

  beforeEach(async () => {
    // Clean up the database before each test
    try {
      await prisma.movement.deleteMany();
      await prisma.inventory.deleteMany();
    } catch (error) {
      console.error("Error cleaning database:", error);
      throw error;
    }
  });

  describe("getBySku", () => {
    it("should return null for non-existent SKU", async () => {
      const result = await repo.getBySku("ABC-0000-XX");
      expect(result).toBeNull();
    });

    it("should return inventory for existing SKU with correct version", async () => {
      const inventory = new ProductInventory(SKU.of("ABC-1234-AB"), 10);
      inventory.reserve(Quantity.of(1));
      await repo.save(inventory);

      const result = await repo.getBySku("ABC-1234-AB");
      expect(result).not.toBeNull();
      expect(result!.sku.toString()).toBe("ABC-1234-AB");
      expect(result!.getAvailable()).toBe(9);
      expect(result!.getVersion()).toBeInstanceOf(Date);
    });
  });

  describe("save", () => {
    it("should create movement for release operation", async () => {
      const inventory = new ProductInventory(SKU.of("ABC-3456-GH"), 10);
      inventory.release(Quantity.of(2));
      await repo.save(inventory);

      const result = await repo.getBySku("ABC-3456-GH");
      expect(result).not.toBeNull();
      expect(result!.getAvailable()).toBe(12);

      // Verify movements were created
      const movements = await prisma.movement.findMany({
        where: { sku: "ABC-3456-GH" },
        orderBy: { createdAt: "asc" },
      });
      expect(movements).toHaveLength(1);
      expect(movements[0].movementType).toBe("RELEASE");
      expect(movements[0].qty).toBe(2);
    });

    it("should handle optimistic locking correctly", async () => {
      // Create initial inventory
      const inventory = new ProductInventory(SKU.of("ABC-7890-CD"), 10);
      inventory.release(Quantity.of(1));
      await repo.save(inventory);

      // Get the inventory with its version
      const firstLoad = await repo.getBySku("ABC-7890-CD");
      expect(firstLoad).not.toBeNull();

      // Simulate concurrent modification by directly updating the database
      await prisma.inventory.update({
        where: { sku: "ABC-7890-CD" },
        data: { available: 15, updatedAt: new Date() },
      });

      // Try to save the old version - should fail
      firstLoad!.release(Quantity.of(1));
      await expect(repo.save(firstLoad!)).rejects.toThrow(
        "Concurrent modification detected"
      );
    });

    it("should update version after successful save", async () => {
      const inventory = new ProductInventory(SKU.of("ABC-5678-EF"), 10);
      inventory.release(Quantity.of(1));
      await repo.save(inventory);

      const firstLoad = await repo.getBySku("ABC-5678-EF");
      const firstVersion = firstLoad!.getVersion();

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Modify and save
      firstLoad!.release(Quantity.of(5));
      await repo.save(firstLoad!);

      const secondLoad = await repo.getBySku("ABC-5678-EF");
      const secondVersion = secondLoad!.getVersion();

      // Verify version was updated
      expect(secondVersion.getTime()).toBeGreaterThan(firstVersion.getTime());
      expect(secondLoad!.getAvailable()).toBe(16);
    });
  });
});
