import { PrismaClient } from "@prisma/client";
import { createContainer, InjectionMode, asClass, asValue } from "awilix";
import { ProductInventoryAdapter } from "../infrastructure/postgres/ProductInventoryRepositoryAdapter";
import { ReserveInventoryUseCase } from "./ReserveInventoryUseCase";
import { ReleaseInventoryUseCase } from "./ReleaseInventoryUseCase";
import { ReplenishInventoryUseCase } from "./ReplenishInventoryUseCase";
import { ProductInventoryEventsAdapter } from "../infrastructure/events/ProductInventoryEventsAdapter";
import { config } from "../config/config";
import { CreateInventoryUseCase } from "./CreateInventoryUseCase";
import { prisma } from "../infrastructure/postgres/PrismaClientProvider";

export const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});

// Define initialization order
const INITIALIZATION_ORDER = [
  "prisma",
  "productInventoryEvents",
  "inventoryRepo",
  "reserveInventoryUseCase",
  "releaseInventoryUseCase",
  "replenishInventoryUseCase",
] as const;

container.register({
  // config
  config: asValue(config),

  // Singleton para la conexión a la BBDD
  prisma: asValue(prisma),

  // Repository
  inventoryRepo: asClass(ProductInventoryAdapter).scoped(),

  // Events
  productInventoryEvents: asClass(ProductInventoryEventsAdapter)
    .singleton()
    .disposer((adapter) => adapter.dispose()),

  // Application usecases
  reserveInventoryUseCase: asClass(ReserveInventoryUseCase).scoped(),
  releaseInventoryUseCase: asClass(ReleaseInventoryUseCase).scoped(),
  replenishInventoryUseCase: asClass(ReplenishInventoryUseCase).scoped(),
  createInventoryUseCase: asClass(CreateInventoryUseCase).scoped(),
});

export async function bootstrapContainer() {
  const initialized = new Set<string>();

  // Initialize components in order
  for (const name of INITIALIZATION_ORDER) {
    try {
      const instance = container.resolve(name);
      if (instance.init) {
        await instance.init();
        initialized.add(name);
      }
    } catch (error) {
      console.error(`Error initializing ${name}:`, error);
      throw error;
    }
  }

  // Log initialization status
  console.log(
    `Initialized ${initialized.size} components`,
    `${Array.from(initialized).join(", ")}`
  );
}

export async function disposeContainer() {
  await container.dispose();
}
