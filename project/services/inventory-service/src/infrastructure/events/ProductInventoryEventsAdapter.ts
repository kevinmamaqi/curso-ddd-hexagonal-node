import amqplib, { Channel, ChannelModel } from "amqplib";
import { ProductInventoryEventsPort } from "../../domain/ports/ProductInventoryEventsPort";
import { Quantity } from "../../domain/value-objects/Quantity";
import { SKU } from "../../domain/value-objects/SKU";
import { AppConfig } from "../../config/config";

export class ProductInventoryEventsAdapter
  implements ProductInventoryEventsPort
{
  private connection!: ChannelModel;
  private channel!: Channel;
  private readonly exchangeName = "inventory_events";
  private readonly exchangeType = "topic";

  private readonly amqpUrl: string;
  private readonly maxRetries = 5;
  private readonly retryDelay = 1000; // 1 second

  constructor(private readonly config: AppConfig) {
    this.amqpUrl = config.rabbitUrl;
  }

  private async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async init(): Promise<void> {
    let retries = 0;
    let lastError: Error | null = null;

    while (retries < this.maxRetries) {
      try {
        this.connection = await amqplib.connect(this.amqpUrl);
        this.channel = await this.connection.createChannel();
        await this.channel.assertExchange(
          this.exchangeName,
          this.exchangeType,
          {
            durable: true,
          }
        );
        console.log("Successfully connected to RabbitMQ");
        return;
      } catch (error) {
        lastError = error as Error;
        console.error(
          `Failed to connect to RabbitMQ (attempt ${retries + 1}/${
            this.maxRetries
          }):`,
          error
        );
        retries++;
        if (retries < this.maxRetries) {
          await this.wait(this.retryDelay);
        }
      }
    }

    throw new Error(
      `Failed to connect to RabbitMQ after ${this.maxRetries} attempts: ${lastError?.message}`
    );
  }

  async dispose(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
    } catch (error) {
      console.error("Error disposing RabbitMQ connection:", error);
    }
  }

  private async ensureConnection(): Promise<void> {
    if (!this.channel) {
      await this.init();
    }
  }

  private async publishEvent(
    eventType: string,
    version: number,
    payload: any,
    routingKey: string
  ) {
    await this.ensureConnection();

    const event = {
      type: eventType,
      version,
      ...payload,
      timestamp: new Date().toUTCString(),
    };

    try {
      this.channel.publish(
        this.exchangeName,
        routingKey,
        Buffer.from(JSON.stringify(event)),
        { persistent: true }
      );
    } catch (error) {
      console.error("Error publishing event:", error);
      throw error;
    }
  }

  async emitProductInventoryReserved(sku: SKU, qty: Quantity): Promise<void> {
    await this.publishEvent(
      "ProductInventoryReserved",
      1,
      {
        sku: sku.toString(),
        quantity: qty.toNumber(),
      },
      "product.inventory.reserved"
    );
  }
  async emitProductInventoryReleased(sku: SKU, qty: Quantity): Promise<void> {
    await this.publishEvent(
      "ProductInventoryReleased",
      1,
      {
        sku: sku.toString(),
        quantity: qty.toNumber(),
      },
      "product.inventory.released"
    );
  }
  async emitProductInventoryReplenished(
    sku: SKU,
    qty: Quantity
  ): Promise<void> {
    await this.publishEvent(
      "ProductInventoryReplenished",
      1,
      {
        sku: sku.toString(),
        quantity: qty.toNumber(),
      },
      "product.inventory.replenished"
    );
  }

  async emitProductInventoryCreated(sku: SKU, qty: Quantity): Promise<void> {
    await this.publishEvent(
      "product.inventory.created",
      1,
      {
        sku: sku.toString(),
        qty: qty.toNumber(),
        timestamp: new Date().toISOString(),
      },
      "product.inventory.created"
    );
  }
}
