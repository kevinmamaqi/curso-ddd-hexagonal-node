export interface OrderServicePort {
  replenish(sku: string): Promise<void>;
}
