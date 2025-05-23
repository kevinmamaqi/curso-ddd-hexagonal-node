import { FastifyInstance } from "fastify";
import { container } from "../../application/container";

export function registerRoutes(app: FastifyInstance) {
  app.get("/inventory/:sku", async (request, reply) => {
    const { sku } = request.params as { sku: string };
    const inventory = await container
      .resolve("getInventoryUseCase")
      .execute(sku);
    return reply.send(inventory);
  });
}
