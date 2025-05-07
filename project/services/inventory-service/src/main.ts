// src/main.ts
import Fastify from "fastify";
import "dotenv/config";
import { container } from "./application/container";
import { registerInventoryRoutes } from "./infrastructure/http/ProductInventoryRouter";

export async function buildServer() {
  const app = Fastify({ logger: true });

  //   Initialize container
  await container.dispose();

  //   Application routes
  await registerInventoryRoutes(app);

  app.get("/health", async () => ({ status: "ok" }));
  return app;
}

// Cuando este archivo se ejecute directamente con `node dist/main.js`
if (import.meta.url === `file://${process.argv[1]}`) {
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  buildServer()
    .then((app) => app.listen({ port: PORT }))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
