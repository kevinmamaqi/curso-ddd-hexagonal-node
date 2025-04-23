# Tema VI (parte 4) — Trazabilidad de Eventos con OpenTelemetry

## 1. Instrumentación básica

```ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-otlp-http';

new NodeSDK({
  traceExporter: new OTLPTraceExporter({ url: 'http://otel-collector:4318/v1/traces' }),
  instrumentations: [ /* http, amqplib */ ],
}).start();
```

`instrumentation-amqplib` añade span `rabbitmq.consume` con tags `routing_key`, `queue`.

## 2. Propagación de contexto

```ts
publisher.publish(event, { headers: { traceparent: trace.getSpan(context.active()).spanContext().traceId } });
```

Consumer:

```ts
const parentCtx = propagation.extract(context.active(), msg.properties.headers);
context.with(parentCtx, () => handler(event));
```

## 3. Dashboard recomendado

- **Panel 1**: Throughput mensajes por tipo.  
- **Panel 2**: Latencia p95 por consumidor.  
- **Panel 3**: Retries / minuto.  
- **Panel 4**: Mensajes en poison queue.

> Si p95 > 500 ms → alerta Slack.