import { TestSetup } from "./helpers/testSetup";
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import amqplib from "amqplib";

describe(
  "Inventory System Tests",
  () => {
    let testSetup: TestSetup;

    beforeAll(async () => {
      testSetup = new TestSetup();
      await testSetup.setup();
    }, 30000);

    afterAll(async () => {
      await testSetup.teardown();
    }, 30000);

    beforeEach(async () => {
      await testSetup.cleanDatabase();
    });

    it("should create inventory and publish event to RabbitMQ", async () => {
      const app = testSetup.getApp();
      const prisma = testSetup.getPrisma();
      const amqpUrl = process.env.AMQP_URL!;

      // 1) Spin up your own private queue
      const conn = await amqplib.connect(amqpUrl);
      const ch = await conn.createChannel();
      const { queue } = await ch.assertQueue("", { exclusive: true });

      // 2) Bind it to the same EXCHANGE & ROUTING KEY your adapter uses
      //    (exchangeName = "inventory_events", routingKey = "product.inventory.created")
      await ch.bindQueue(
        queue,
        "inventory_events",
        "product.inventory.created"
      );

      // 3) Set up a promise that resolves as soon as we see a single message
      const gotMsg = new Promise<amqplib.ConsumeMessage>((resolve, reject) => {
        // guard against hanging forever
        const timer = setTimeout(() => {
          reject(new Error("RabbitMQ message never arrived"));
        }, 5_000);

        ch.consume(
          queue,
          (msg) => {
            if (!msg) return;
            clearTimeout(timer);
            ch.ack(msg);
            resolve(msg);
          },
          { noAck: false }
        );
      });

      // 4) Fire the HTTP call *after* your consumer is in place
      const createResponse = await app.inject({
        method: "POST",
        url: "/inventory",
        payload: { sku: "ABC-1234-AB", qty: 10 },
      });
      expect(createResponse.statusCode).toBe(201);

      // 5) Now wait for the publish
      const msg = await gotMsg;
      const body = JSON.parse(msg.content.toString());
      expect(body.type).toBe("product.inventory.created");
      expect(body.sku).toBe("ABC-1234-AB");
      expect(body.qty).toBe(10);

      // 6) Cleanup
      await ch.close();
      await conn.close();

      // 7) Bonus: verify DB too
      const inv = await prisma.inventory.findUnique({
        where: { sku: "ABC-1234-AB" },
      });
      expect(inv).not.toBeNull();
      expect(inv!.available).toBe(10);
      const moves = await prisma.movement.findMany({
        where: { sku: "ABC-1234-AB" },
      });
      expect(moves).toHaveLength(1);
      expect(moves[0].movementType).toBe("CREATED");
      expect(moves[0].qty).toBe(10);
    });
  },
  { timeout: 30000 }
);
