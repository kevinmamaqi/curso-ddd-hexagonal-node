import Fastify from "fastify";
import { bootstrapContainer, disposeContainer } from "./application/container";
import { registerRoutes } from "./infrastructure/http/routes";
import { startTelemetry, stopTelemetry } from "./otel";

export async function buildServer() {
  await startTelemetry();
  await bootstrapContainer();

  const app = Fastify({ logger: true });
  app.get("/health", async () => ({ status: "ok" }));
  registerRoutes(app);

  app.addHook("onClose", async () => {
    await disposeContainer();
    await stopTelemetry();
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
