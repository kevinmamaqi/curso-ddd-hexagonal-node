# Tema 5 (parte 2) — Implementación práctica de CQRS en Node.js

## 1. Estructura mínima de carpetas

```
order-service/
├── src/
│   ├── command/
│   │   ├── handlers/
│   │   └── validations/
│   ├── query/
│   │   └── handlers/
│   ├── domain/          ← Aggregate + VO
│   ├── infrastructure/
│   │   ├── event-store/ ← adapter
│   │   └── read-model/  ← adapter
└── ...
```

## 2. Commands y Handlers

```ts
// command/commands/create-order.cmd.ts
export interface CreateOrderCmd {
  type: 'CreateOrder';
  payload: { customerId: string; items: { sku: string; qty: number }[] };
}
```

```ts
// command/handlers/create-order.handler.ts
import { z } from 'zod';
import { OrderRepositoryPort } from '../../domain/order-repo.port';

const schema = z.object({
  customerId: z.string().uuid(),
  items: z.array(z.object({ sku: z.string(), qty: z.number().int().positive() })),
});

export const createOrderHandler =
  (repo: OrderRepositoryPort) =>
  async (cmd: CreateOrderCmd) => {
    schema.parse(cmd.payload);               // ★ Validación middleware
    const order = Order.create(cmd.payload);
    await repo.save(order);                  // persiste eventos
  };
```

## 3. Queries y Handlers

```ts
// query/queries/get-order-summary.q.ts
export interface GetOrderSummaryQ {
  type: 'GetOrderSummary';
  payload: { orderId: string };
}
```

```ts
// query/handlers/get-order-summary.handler.ts
import { ReadModelPort } from '../ports/read-model.port';

export const getOrderSummaryHandler =
  (rm: ReadModelPort) =>
  async (q: GetOrderSummaryQ) => rm.byId(q.payload.orderId);
```

## 4. Event Store adapter (simplificado)

```ts
export class PostgresEventStore implements EventStorePort {
  async append(events: DomainEvent[]) {
    const values = events.map(e => [e.type, e.occurredAt, JSON.stringify(e)]);
    await db.query('INSERT INTO event_store(type, occurred_at, payload) VALUES %L', values);
  }
  async byAggregate(id: string) { /* … */ }
}
```

## 5. Proyector → Read Model

```ts
// application/projectors/order-summary.projector.ts
import { OrderCreated } from '../../domain/events/order-created.event';
import { sql } from '@pgtyped/runtime';

export const onOrderCreated = async (e: OrderCreated) => {
  await sql`
    INSERT INTO order_summary (id, customer_id, status, total)
    VALUES (${e.payload.orderId}, ${e.payload.customerId}, 'PENDING', 0)
  `;
};
```

Suscrito en adapter RabbitMQ:

```ts
channel.consume('domain.OrderCreated', msg => {
  const e = JSON.parse(msg.content.toString()) as OrderCreated;
  onOrderCreated(e);
  channel.ack(msg);
});
```

## 6. Middleware para validación y logging

```ts
export const withValidation =
  <C>(handler: (c: C) => Promise<void>, schema: z.ZodTypeAny) =>
  async (cmd: C) => {
    schema.parse((cmd as any).payload);
    return handler(cmd);
  };
```

## 7. Estrategia de transacción

- Commands → `BEGIN; append events; COMMIT;`  
- Projector asíncrono → *exactly-once* con `event_id` deduplicado en tabla de offset.

---

## 8. Ejercicio práctico (60 min)

> Caso: **“ApproveCredit”** en `billing-service`

1. Command `ApproveCredit` con payload `{ customerId, amount }`.  
2. Handler: valida `amount ≤ limit`, emite `CreditApproved`.  
3. Projector: tabla `credit_read` con saldo acumulado.  
4. Query `GetCreditBalance`.  

Commit: `feat(billing): cqrs approve credit`.