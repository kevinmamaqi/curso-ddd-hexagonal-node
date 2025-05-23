import { asClass, createContainer } from "awilix";
import { OrderEventsAdapter } from "../infrastructure/rabbitmq/OrderEventsAdapter";
import { ReplenishUseCase } from "./ReplenishUseCase";

export const container = createContainer({
  injectionMode: "CLASSIC",
});

export async function bootstrapContainer() {
  container.register({
    orderEvents: asClass(OrderEventsAdapter).singleton(),
    replenishUseCase: asClass(ReplenishUseCase).scoped(),
  });
}
