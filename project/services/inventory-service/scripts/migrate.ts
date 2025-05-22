#!/usr/bin/env ts-node-script
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { execSync } from "child_process";
import { promises as fs } from "fs";
import { join } from "path";

/**
 * This script handles Prisma migrations using testcontainers:
 * 1. Starts a PostgreSQL container using testcontainers
 * 2. Applies migrations or creates new ones
 * 3. Cleans up the container when done
 *
 * Usage:
 *   npm run migrate -- create [migration-name]  # Create a new migration
 *   npm run migrate -- deploy                   # Apply existing migrations
 *   npm run migrate                             # Development mode: apply migrations
 */

// Parse command arguments
const [, , command = "deploy", migrationName] = process.argv;

async function ensureDirExists(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (err: any) {
    if (err.code !== "EEXIST") throw err;
  }
}

async function main(): Promise<void> {
  let container;

  try {
    console.log("🐳 Starting PostgreSQL container using testcontainers...");

    // Start PostgreSQL container using testcontainers
    container = await new PostgreSqlContainer("postgres:17-alpine")
      .withDatabase("inventory_dev")
      .withUsername("postgres")
      .withPassword("postgres")
      .start();

    // Get the connection URI
    const connectionString = container.getConnectionUri();
    console.log(`🔌 Connected to PostgreSQL at ${connectionString}`);

    // Set DATABASE_URL for Prisma
    process.env.DATABASE_URL = connectionString;

    // Ensure migrations directory exists
    await ensureDirExists(join(process.cwd(), "prisma", "migrations"));

    if (command === "create" && migrationName) {
      // Create a new migration
      console.log(`🔄 Creating migration: ${migrationName}...`);
      execSync(`npx prisma migrate dev --name ${migrationName}`, {
        stdio: "inherit",
        env: { ...process.env, DATABASE_URL: connectionString },
      });
    } else {
      // Apply existing migrations
      console.log("🔄 Applying migrations...");
      execSync("npx prisma migrate deploy", {
        stdio: "inherit",
        env: { ...process.env, DATABASE_URL: connectionString },
      });

      // In deploy mode, generate client
      if (command === "deploy") {
        console.log("🔄 Generating Prisma client...");
        execSync("npx prisma generate", { stdio: "inherit" });
      }
    }

    console.log("✅ Migration completed successfully!");
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    // Cleanup: stop the container
    if (container) {
      console.log("🧹 Cleaning up: stopping container...");
      await container.stop();
      console.log("✅ Container stopped successfully.");
    }
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
