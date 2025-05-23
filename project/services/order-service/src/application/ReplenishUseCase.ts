import { OrderEventsPort } from "../domain/ports/OrderEventsPorts";

export class ReplenishUseCase {
  constructor(private readonly orderReplenishPort: OrderEventsPort) {}

  async execute(sku: string, quantity: number) {
    await this.orderReplenishPort.replenish(sku, quantity);
  }
}
