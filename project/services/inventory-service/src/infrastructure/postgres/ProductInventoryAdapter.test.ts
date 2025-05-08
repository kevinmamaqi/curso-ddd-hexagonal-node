import { PrismaClient } from "@prisma/client";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { execSync } from "child_process";
import { ProductInventoryAdapter } from "./ProductInventoryAdapter";
import { ProductInventory } from "../../domain/model/ProductInventoryModel";

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
      const inventory = new ProductInventory("TEST123", 10);
      await repo.save(inventory);

      const result = await repo.getBySku("TEST123");
      expect(result).not.toBeNull();
      expect(result!.sku).toBe("TEST123");
      expect(result!.getAvailable()).toBe(10);
    });
  });

  describe("save", () => {
    it("should save new inventory", async () => {
      const inventory = new ProductInventory("NEW123", 5);
      await repo.save(inventory);

      const result = await repo.getBySku("NEW123");
      expect(result).not.toBeNull();
      expect(result!.getAvailable()).toBe(5);
    });

    it("should update existing inventory", async () => {
      const inventory = new ProductInventory("UPDATE123", 10);
      await repo.save(inventory);

      inventory.reserve(3);
      await repo.save(inventory);

      const result = await repo.getBySku("UPDATE123");
      expect(result).not.toBeNull();
      expect(result!.getAvailable()).toBe(7);
    });
  });
});
