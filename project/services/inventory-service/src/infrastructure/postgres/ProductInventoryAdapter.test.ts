import { PrismaClient } from "@prisma/client";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { execSync } from "child_process";
import { ProductInventoryAdapter } from "./ProductInventoryAdapter";
import { ProductInventory } from "../../domain/model/ProductInventoryModel";
import { SKU } from "../../domain/value-objects/SKU";
import { Quantity } from "../../domain/value-objects/Quantity";

// Increase timeout for container startup
jest.setTimeout(10000);

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
      await prisma.inventory.deleteMany();
    } catch (error) {
      console.error("Error cleaning database:", error);
      throw error;
    }
  });

  describe("getBySku", () => {
    it("should return null for non-existent SKU", async () => {
      const result = await repo.getBySku("NONEXISTENT");
      expect(result).toBeNull();
    });

    it("should return inventory for existing SKU", async () => {
      const sku = SKU.of("AAA-1234-BB");
      const inventory = new ProductInventory(sku, 10);
      await repo.save(inventory);

      const result = await repo.getBySku("AAA-1234-BB");
      expect(result).not.toBeNull();
      expect(result!.sku.toString()).toBe("AAA-1234-BB");
      expect(result!.getAvailable()).toBe(10);
    });
  });

  describe("save", () => {
    it("should save new inventory", async () => {
      const sku = SKU.of("AAA-1234-BB");
      const inventory = new ProductInventory(sku, 5);
      await repo.save(inventory);

      const result = await repo.getBySku("AAA-1234-BB");
      expect(result).not.toBeNull();
      expect(result!.getAvailable()).toBe(5);
    });

    it("should update existing inventory", async () => {
      const sku = SKU.of("AAA-1234-CC");
      const quantity = Quantity.of(10);
      const inventory = new ProductInventory(sku, 10);
      await repo.save(inventory);

      inventory.reserve(quantity);
      await repo.save(inventory);

      const result = await repo.getBySku("AAA-1234-CC");
      expect(result).not.toBeNull();
      expect(result!.getAvailable()).toBe(0);
    });
  });
});
