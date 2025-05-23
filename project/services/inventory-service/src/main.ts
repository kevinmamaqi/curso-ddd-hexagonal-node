// src/main.ts
import Fastify from "fastify";
import "dotenv/config";
import { bootstrapContainer, disposeContainer } from "./application/container";
import { registerInventoryRoutes } from "./infrastructure/http/ProductInventoryRouter";
import { startTelemetry, stopTelemetry } from "./otel";

export async function buildServer() {
  await startTelemetry();

  // Initialize container
  await bootstrapContainer();

  // Application routes
  const app = Fastify({ logger: true });
  await registerInventoryRoutes(app);

  app.addHook("onClose", async () => {
    await disposeContainer();
    await stopTelemetry();
  });

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
