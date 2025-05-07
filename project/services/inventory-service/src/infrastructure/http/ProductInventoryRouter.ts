import { FastifyInstance } from "fastify";
import { container } from "../../application/container";
import { ReserveInventoryUseCase } from "../../application/ReserveInventoryUseCase";

export async function registerInventoryRoutes(app: FastifyInstance) {
  app.post("/inventory/:sku/reserve", async (req, reply) => {
    const { sku } = req.params as { sku: string };
    const { qty } = req.body as { qty: number };

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
      return reply.status(400).send({ error: err.message });
    }
  });
}
