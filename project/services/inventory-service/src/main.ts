// src/main.ts
import Fastify from "fastify";
import "dotenv/config";

export async function buildServer() {
  const app = Fastify({ logger: true });
  // TODO: registrar rutas, plugins, etc.
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
