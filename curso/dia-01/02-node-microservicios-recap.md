# Sesión 1 · Microservicios en Node.js – Estado del Arte (2025)

> _Spoiler:_ Node no es la panacea, pero si se emplea con rigor y TypeScript, junto a su modelo asíncrono podemos crear aplicaciones de alto rendimiento.

---

## 1. El Event Loop y su impacto en Microservicios

Node.js se basa en **un único hilo de ejecución** (event loop) gestionado por libuv, al que se suman **operaciones I/O** delegadas a una _thread pool_. Comprender este modelo es importante una vez llegamos a problemas de escalabilidad/memoria/performance, etc...:

1. **Arquitectura del Event Loop**

   - libuv orquesta varias **fases** (timers, poll, check, close) que procesan callbacks en cola.
   - Las operaciones de red o disco se envían a la thread pool y, al completarse, su callback vuelve al loop principal.
   - Documentación oficial: <https://nodejs.org/dist/latest-v20.x/docs/api/async_context.html> y <https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick>

2. **Single thread ≠ single core**

   - Aunque el loop sea single-threaded, la thread pool (por defecto 4 hilos) maneja tareas CPU-bound como compresión, cifrado o acceso a ficheros.
   - Permite delegar trabajo pesado y mantener el loop libre para atender conexiones entrantes.

3. **Back-pressure y streams**

   - En conexión HTTP o TCP, si el consumidor procesa más lento que el emisor, la **cola de callbacks** crece y puede saturar memoria.
   - Node proporciona APIs de **Streams** con `pause()`/`resume()` y eventos `drain` para controlar el flujo de datos:
     ```ts
     readable.pipe(writable, { end: false });
     writable.on("drain", () => readable.resume());
     readable.pause();
     ```

4. **Graceful shutdown en tests y producción**

   - En entornos de test es común encontrar “handles” colgantes si no cerramos el servidor y las conexiones pendientes.
   - Use siempre
     ```ts
     await fastify.close();
     process.exit(0);
     ```
     para forzar el cierre limpio y evitar fugas de recursos.

5. **Referencias útiles**
   - Artículo visual: <https://www.builder.io/blog/visual-guide-to-nodejs-event-loop>
   - Profundización en phases y ticks: <https://developer.ibm.com/tutorials/learn-nodejs-the-event-loop/>

```mermaid
sequenceDiagram
    participant Client
    participant Fastify
    participant DB
    Note over Fastify: Event Loop<br/> (libuv)
    Client->>Fastify: HTTP Request
    Fastify->>DB: Query
    DB-->>Fastify: Rows
    Fastify-->>Client: JSON
```

---

## 2. Toolkit 2025 recomendado

| Necesidad      | Librería / Tool                               | Motivo                                               |
| -------------- | --------------------------------------------- | ---------------------------------------------------- |
| HTTP API       | **Fastify 4**                                 | 30‑40 % +rápido que Express, plugin ecosystem maduro |
| Broker         | **RabbitMQ 3.13**                             | Durable, buen soporte plugins, UI comprensible       |
| DB             | **PostgreSQL 16** + Prisma                    | TX ACID, rich JSON ops, migraciones declarativas     |
| Observabilidad | **OpenTelemetry 1.29** + Prometheus + Grafana | Estándar de facto                                    |
| Testing        | **Vitest**                                    | ESM native, peso pluma, mocking builtin              |
| Lint/Fmt       | **ESLint** + **Biome**                        | Biome reemplaza Prettier y acelera CI                |

---

## 3. Esqueleto mínimo de un microservicio Node + Hexagonal

```text
inventory-service/
│
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   └── value-objects/
│   ├── application/
│   │   ├── commands/
│   │   ├── queries/
│   │   └── services/
│   ├── infrastructure/
│   │   ├── repositories/
│   │   └── messaging/
│   └── main.ts        ← Adapter HTTP (Fastify)
│
├── tests/             ← prueban solo dominio + app (sin infra real)
├── package.json
└── Dockerfile
```

### main.ts (Adapter HTTP muy fino)

```ts
// src/main.ts
import Fastify from "fastify";
import { createOrderHandler } from "./infrastructure/http/order-handlers";

export const buildServer = () => {
  const app = Fastify({ logger: true });

  app.post("/orders", createOrderHandler);

  return app;
};

if (require.main === module) {
  buildServer().listen({ port: +process.env.PORT! || 3000 }, (err, addr) => {
    if (err) throw err;
    console.log(`🚀  up on ${addr}`);
  });
}
```

_Nota:_ La lógica de negocio está en `domain/` y `application/`, **no** aquí.

---

## 4. Docker‑compose de referencia (recorte)

```yaml
version: "3.9"
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secret
    ports: ["5432:5432"]
  rabbit:
    image: rabbitmq:3.13-management
    ports: ["5672:5672", "15672:15672"]

  inventory-service:
    build: ./services/inventory-service
    depends_on: [postgres, rabbit]
    environment:
      DATABASE_URL: "postgresql://postgres:secret@postgres:5432/inventory"
      RABBIT_URL: "amqp://guest:guest@rabbit:5672"
```

Con esto, un **`docker compose up -d`** y el equipo está listo para el _hands‑on_.

---

## 5. Errores comunes en Node Microservices

1. **Bloquear el hilo** con CPU heavy (PDF generation) sin off‑load.
2. Confiar en `console.log` como sistema de logging → usa `pino`.
3. Contenedores sin límites de memoria → OOM killer en producción.
4. Tests que dependen de la DB real → ralentizan pipeline; usa dobles o testcontainers.
5. Repetir lógica de validación en capa HTTP y dominio. **DRY it!**

---

## 6. Checklist de “vida o muerte” para producción

- `process.on('unhandledRejection')` → log + exit(1)
- Health‑checks `/live` y `/ready` separados
- Traces 100 % de requests que incluyan _message IDs_
- Política de _retry_ idempotente en brokers
- Límite de 500 MB RAM por container (k8s/compose)

> **El checklist sirve para** evitar incidentes serios a las 3 a.m.
