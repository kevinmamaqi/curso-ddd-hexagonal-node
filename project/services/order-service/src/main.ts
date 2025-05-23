// src/main.ts
import Fastify from "fastify";
import { bootstrapContainer, container } from "./application/container";
import { startTelemetry, stopTelemetry } from "./otel";
import { registerRoutes } from "./infrastructure/http/routes";

export async function buildServer() {
  await startTelemetry();
  await bootstrapContainer();
  const app = Fastify({ logger: true });
  // TODO: registrar rutas, plugins, etc.
  app.get("/health", async () => ({ status: "ok" }));

  await registerRoutes(app);

  app.addHook("onClose", async () => {
    await stopTelemetry();
    await container.dispose();
  });
  return app;
}

// Cuando este archivo se ejecute directamente con `node dist/main.js`
if (import.meta.url === `file://${process.argv[1]}`) {
  buildServer()
    .then((app) => app.listen({ port: +process.env.PORT! }))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
