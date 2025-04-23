# Tema VI (parte 2) — Implementación EDA en Node.js con RabbitMQ

## 1. Configurar RabbitMQ

```yaml
# docker-compose extract
rabbit:
  image: rabbitmq:3.13-management
  ports: ["5672:5672", "15672:15672"]
  environment:
    RABBITMQ_DEFAULT_USER: guest
    RABBITMQ_DEFAULT_PASS: guest
```

## 2. Publicador robusto

```ts
import amqplib from 'amqplib';

export const createPublisher = async () => {
  const conn = await amqplib.connect('amqp://rabbit');
  const ch = await conn.createConfirmChannel();
  await ch.assertExchange('domain', 'fanout', { durable: true });

  return {
    publish: (event: DomainEvent) =>
      ch.publish('domain', '', Buffer.from(JSON.stringify(event)), { contentType: 'application/json' }),
  };
};
```

## 3. Consumidor con retry y DLX

```ts
const setupConsumer = async (queue: string, handler: (e: any) => Promise<void>) => {
  const conn = await amqplib.connect('amqp://rabbit');
  const ch = await conn.createChannel();

  await ch.assertExchange('domain', 'fanout', { durable: true });
  await ch.assertExchange('dead-letter', 'fanout', { durable: true });
  await ch.assertQueue(queue, {
    durable: true,
    deadLetterExchange: 'dead-letter',
    arguments: { 'x-message-ttl': 60000 }, // retry after 60s
  });
  await ch.bindQueue(queue, 'domain', '');

  ch.consume(queue, async (msg) => {
    try {
      const ev = JSON.parse(msg!.content.toString());
      await handler(ev);
      ch.ack(msg!);
    } catch (err) {
      ch.nack(msg!, false, false); // dead-letter
    }
  });
};
```

## 4. Back-off exponencial

Implementar con re-publicación:

```ts
function delayHeader(retries: number) {
  return retries === 0 ? 0 : Math.min(2 ** retries * 1000, 60000);
}
```

Usar header `x-delay` con plugin RabbitMQ Delayed Message o cola TTL.

## 5. Ejemplo: publicar `OrderCompleted`

```ts
publisher.publish({
  type: 'OrderCompleted',
  v: 2,
  occurredAt: new Date().toISOString(),
  payload: { orderId, customerId },
});
```

Inventory y Analytics se suscriben con colas `inventory.order-completed`, `analytics.order-completed`.

## 6. Estrategia de idempotencia

- Campo `event_id` (UUID) en header.  
- Consumidor mantiene tabla `processed_events(event_id PK)`; ignora duplicados.