import { InventoryServicePort } from "../domain/ports/InventoryServicePort";
import { OrderServicePort } from "../domain/ports/OrderServicePort";

export class GetInventoryUseCase {
  private readonly MIN_QUANTITY = 5;
  constructor(
    private readonly inventoryService: InventoryServicePort,
    private readonly orderService: OrderServicePort
  ) {}

  async execute(sku: string) {
    const inventoryProduct = await this.inventoryService.get(sku);

    if (inventoryProduct.quantity < this.MIN_QUANTITY) {
      await this.orderService.replenish(sku);
    }

    return inventoryProduct;
  }
}
