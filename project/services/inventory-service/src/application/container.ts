import { PrismaClient } from "@prisma/client";
import { createContainer, InjectionMode, asClass } from "awilix";
import { ProductInventoryAdapter } from "../infrastructure/postgres/ProductInventoryAdapter";
import { ReserveInventoryUseCase } from "./ReserveInventoryUseCase";

export const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});

container.register({
  // Singleton para la conexión a la BBDD
  prisma: asClass(PrismaClient).singleton(),

  // Repository
  inventoryRepo: asClass(ProductInventoryAdapter).scoped(),

  // Application usecases
  reserveInventoryUseCase: asClass(ReserveInventoryUseCase).scoped(),
});
