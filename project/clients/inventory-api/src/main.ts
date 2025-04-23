// src/main.ts
import Fastify from "fastify";

export async function buildServer() {
  const app = Fastify({ logger: true });
  // TODO: registrar rutas, plugins, etc.
  app.get("/health", async () => ({ status: "ok" }));
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
