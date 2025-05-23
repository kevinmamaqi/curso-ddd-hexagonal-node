import { AppConfig } from "../../config/config";
import { OrderServicePort } from "../../domain/ports/OrderServicePort";

export class OrderServiceHttpAdapter implements OrderServicePort {
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

  async replenish(sku: string): Promise<void> {
    try {
      return this.fetchWithErrorHandling<void>(
        `${this.config.orderServiceUrl}/order`,
        {
          method: "POST",
          body: JSON.stringify({ sku }),
        }
      );
    } catch (error) {
      throw new Error(`Error replenishing ${sku}: ${error}`);
    }
  }
}
