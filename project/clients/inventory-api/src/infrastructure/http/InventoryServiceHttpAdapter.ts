import { AppConfig } from "../../config/config";
import { InventoryServicePort } from "../../domain/ports/InventoryServicePort";
import { InventoryProduct } from "../../domain/types/inventory";

export class InventoryServiceHttpAdapter implements InventoryServicePort {
  constructor(private readonly config: AppConfig) {}

  private async fetchWithErrorHandling<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching ${url}: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  async get(sku: string): Promise<InventoryProduct> {
    try {
      return this.fetchWithErrorHandling<InventoryProduct>(
        `${this.config.inventoryServiceUrl}/inventory/${sku}`
      );
    } catch (error) {
      throw new Error(`Error fetching ${sku}: ${error}`);
    }
  }
}
