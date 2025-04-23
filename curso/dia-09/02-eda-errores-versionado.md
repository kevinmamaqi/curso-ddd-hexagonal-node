# Tema VI (parte 3) — Errores, Retries y Versionado Evolutivo

## 1. Clasificación de fallos

| Tipo | Ejemplo | Acción |
|------|---------|--------|
| **Transitorio** | Timeout BD | Retry con back-off |
| **Permanente** | Evento corrupto | Mover a *poison queue* |

### 1.1 Implementar poison queue en RabbitMQ

```bash
rabbitmqadmin declare exchange name=dead-letter.poison type=fanout durable=true
rabbitmqadmin declare queue name=poison durable=true
rabbitmqadmin declare binding source=dead-letter.poison destination=poison
```

Configura cola de consumo con:

```json
{ "x-dead-letter-exchange": "dead-letter.poison" }
```

## 2. Retry exponencial con límite

```ts
const MAX = 5;
const delay = (attempt: number) => Math.min(2 ** attempt * 1000, 120000);

function nackRetry(ch, msg) {
  const attempt = (msg.properties.headers['x-attempt'] ?? 0) + 1;
  if (attempt > MAX) return ch.nack(msg, false, false); // poison
  ch.nack(msg, false, false, {
    headers: { 'x-attempt': attempt, 'x-delay': delay(attempt) },
  });
}
```

## 3. Versionado evolutivo de eventos

### 3.1 Estrategias

| Estrategia | Cuándo usar |
|------------|-------------|
| **Tolerant Reader** | Campos nuevos opcionales |
| **Up-caster** | Cambio estructural roto pero backward-able |
| **Parallel Topic** | Ruptura mayor; publicar `OrderCompleted.v3` |

### 3.2 Up-caster ejemplo

```ts
export const upcastOrderCompleted = (raw: any): OrderCompletedV2 => {
  if (raw.v === 1) {
    const [orderId, customerId] = raw.id.split('|');
    return { ...raw, v: 2, orderId, customerId };
  }
  return raw; // v2 passthrough
};
```

Consumer pipeline:

```ts
const event = upcastOrderCompleted(JSON.parse(msg.content.toString()));
handler(event);
```

## 4. Observabilidad de eventos

- **Trace context**: añade `trace_id` header (W3C).  
- **Metric**: `event_processing_seconds{type="OrderCompleted"}` histogram.  
- **Dashboard**: latencia p95, tasa de retry, mensajes en *poison*.

Grafana panel query ejemplo:

```
rate(event_processing_seconds_sum{type="OrderCompleted"}[5m]) /
rate(event_processing_seconds_count{type="OrderCompleted"}[5m])
```