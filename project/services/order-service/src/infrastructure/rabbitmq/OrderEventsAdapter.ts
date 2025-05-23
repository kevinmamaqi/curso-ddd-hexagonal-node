import { Channel, ChannelModel, connect } from "amqplib";
import { OrderEventsPort } from "../../domain/ports/OrderEventsPorts";

export class OrderEventsAdapter implements OrderEventsPort {
  private channel: Channel | null = null;
  private connection: ChannelModel | null = null;
  private readonly EXCHANGE_NAME = "order_events";
  private readonly ROUTING_KEY = "order.replenish";

  constructor() {
    this.init();
  }

  private async init() {
    try {
      this.connection = await connect(process.env.RABBITMQ_URL!);
      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange(this.EXCHANGE_NAME, "topic", {
        durable: true,
      });
      await this.channel.assertQueue(this.ROUTING_KEY, { durable: true });
      await this.channel.bindQueue(
        this.ROUTING_KEY,
        this.EXCHANGE_NAME,
        this.ROUTING_KEY
      );
    } catch (error) {
      console.error("Error initializing RabbitMQ connection", error);
    }
  }

  async replenish(sku: string, quantity: number): Promise<void> {
    try {
      if (!this.channel) {
        throw new Error("RabbitMQ channel not initialized");
      }
      const message = JSON.stringify({ sku, quantity });
      this.channel.publish(
        this.EXCHANGE_NAME,
        this.ROUTING_KEY,
        Buffer.from(message),
        { persistent: true, priority: 10 }
      );
    } catch (error) {
      console.error("Error publishing replenish event", error);
    }
  }
}
