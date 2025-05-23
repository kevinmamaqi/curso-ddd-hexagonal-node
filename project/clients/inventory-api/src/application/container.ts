import { createContainer, InjectionMode, asClass, asValue } from "awilix";
import { config } from "../config/config";
import { GetInventoryUseCase } from "./GetInventoryUseCase";
import { OrderServiceHttpAdapter } from "../infrastructure/http/OrderServiceHttpAdapter";
import { InventoryServiceHttpAdapter } from "../infrastructure/http/InventoryServiceHttpAdapter";

export const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});

container.register({
  config: asValue(config),
  inventoryService: asClass(InventoryServiceHttpAdapter).singleton(),
  orderService: asClass(OrderServiceHttpAdapter).singleton(),
  getInventoryUseCase: asClass(GetInventoryUseCase).singleton(),
});

const INITIALIZATION_ORDER = [
  "config",
  "inventoryService",
  "orderService",
  "getInventoryUseCase",
];

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
    `Initialized ${initialized.size} components:`,
    Array.from(initialized).join(", ")
  );
}

export async function disposeContainer() {
  await container.dispose();
}
