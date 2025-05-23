export interface OrderEventsPort {
  replenish(sku: string, quantity: number): Promise<void>;
}
