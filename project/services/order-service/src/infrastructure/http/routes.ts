import { FastifyInstance } from "fastify";
import { container } from "../../application/container";

export async function registerRoutes(app: FastifyInstance) {
  const orderReplenishUseCase = container.resolve("orderReplenishUseCases");
  app.post("/replenish", async (request, reply) => {
    const { sku, quantity } = request.body as { sku: string; quantity: number };

    await orderReplenishUseCase.replenish(sku, quantity);
    return reply.status(200).send({ message: "Replenished" });
  });
}
