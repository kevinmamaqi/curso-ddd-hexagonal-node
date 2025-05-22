import { FastifyInstance } from "fastify";
import { container } from "../../application/container";
import { ReserveInventoryUseCase } from "../../application/ReserveInventoryUseCase";
import { ReleaseInventoryUseCase } from "../../application/ReleaseInventoryUseCase";
import { ReplenishInventoryUseCase } from "../../application/ReplenishInventoryUseCase";
import { CreateInventoryUseCase } from "../../application/CreateInventoryUseCase";
import { ProductInventoryPort } from "../../domain/ports/ProductInventoryRepositoryPort";

export async function registerInventoryRoutes(app: FastifyInstance) {
  // POST /inventory
  app.post("/inventory", async (req, reply) => {
    const { sku, qty } = req.body as { sku: string; qty: number };

    if (!sku || !qty) {
      return reply.status(400).send({ error: "sku and qty are required" });
    }

    const createInventoryUseCase = container.resolve<CreateInventoryUseCase>(
      "createInventoryUseCase"
    );

    try {
      await createInventoryUseCase.exec(sku, qty);
      return reply.status(201).send();
    } catch (err: any) {
      if (err.message === "Product inventory already exists") {
        return reply.status(409).send({ error: err.message });
      }
      return reply.status(500).send({ error: "Internal server error" });
    }
  });

  // GET /inventory/:sku
  app.get("/inventory/:sku", async (req, reply) => {
    const { sku } = req.params as { sku: string };
    const inventoryRepo =
      container.resolve<ProductInventoryPort>("inventoryRepo");

    try {
      const inventory = await inventoryRepo.getBySku(sku);
      if (!inventory) {
        return reply.status(404).send({ error: "Product not found" });
      }

      return reply.send({
        sku: inventory.sku.toString(),
        available: inventory.getAvailable(),
      });
    } catch (err: any) {
      return reply.status(500).send({ error: "Internal server error" });
    }
  });

  // POST /inventory/:sku/reserve
  app.post("/inventory/:sku/reserve", async (req, reply) => {
    const { sku } = req.params as { sku: string };
    const { qty, orderId } = req.body as { qty: number; orderId: string };

    if (!qty || !orderId) {
      return reply.status(400).send({ error: "qty and orderId are required" });
    }

    const reserveInventoryUseCase = container.resolve<ReserveInventoryUseCase>(
      "reserveInventoryUseCase"
    );

    try {
      await reserveInventoryUseCase.exec(sku, qty);
      return reply.status(204).send();
    } catch (err: any) {
      if (err.message === "Product not found") {
        return reply.status(404).send({ error: err.message });
      }
      if (err.message === "Insufficient product stock") {
        return reply.status(400).send({ error: err.message });
      }
      return reply.status(500).send({ error: "Internal server error" });
    }
  });

  // POST /inventory/:sku/release
  app.post("/inventory/:sku/release", async (req, reply) => {
    const { sku } = req.params as { sku: string };
    const { qty, orderId } = req.body as { qty: number; orderId: string };

    if (!qty || !orderId) {
      return reply.status(400).send({ error: "qty and orderId are required" });
    }

    const releaseInventoryUseCase = container.resolve<ReleaseInventoryUseCase>(
      "releaseInventoryUseCase"
    );

    try {
      await releaseInventoryUseCase.exec(sku, qty);
      return reply.status(204).send();
    } catch (err: any) {
      if (err.message === "Product not found") {
        return reply.status(404).send({ error: err.message });
      }
      return reply.status(500).send({ error: "Internal server error" });
    }
  });

  // POST /inventory/:sku/replenish
  app.post("/inventory/:sku/replenish", async (req, reply) => {
    const { sku } = req.params as { sku: string };
    const { qty } = req.body as { qty: number };

    if (!qty) {
      return reply.status(400).send({ error: "qty is required" });
    }

    const replenishInventoryUseCase =
      container.resolve<ReplenishInventoryUseCase>("replenishInventoryUseCase");

    try {
      await replenishInventoryUseCase.exec(sku, qty);
      return reply.status(204).send();
    } catch (err: any) {
      console.error("Error in replenish endpoint:", err);
      if (err.message === "Product not found") {
        return reply.status(404).send({ error: err.message });
      }
      if (
        err.message === "AMQP Channel Not Initialzied" ||
        err.message === "Unexpected close"
      ) {
        return reply.status(503).send({
          error: "Service temporarily unavailable - Message broker error",
        });
      }
      return reply.status(500).send({ error: "Internal server error" });
    }
  });
}
