# Tema VII (parte 1) — Fundamentos de Observabilidad

## 1. Cuatro señales

| Señal | Qué responde | Herramienta default |
|-------|--------------|---------------------|
| **Logs** | ¿Qué ocurrió? | Loki, ELK |
| **Métricas** | ¿Qué tan a menudo / rápido? | Prometheus |
| **Trazas** | ¿Dónde pasó el tiempo? | Jaeger, Tempo |
| **Profiles** | ¿Qué consume CPU/heap? | Pyroscope, Parca |

## 2. M-E-L Model (Meta-Observability)

- **M**odel → contexto del dominio (events → KPIs).  
- **E**xecution → aplicar instrumentación (OpenTelemetry).  
- **L**everage → dashboards, alertas, autoscaling.

## 3. OpenTelemetry Essentials

- **API** (tracer, meter, logger)  
- **SDK** (exporters, samplers, processors)  
- **OTLP** protocolo estándar (gRPC/HTTP)

```ts
meter.createHistogram('cart_value_total', { unit: 'COP', description: 'Valor total del carrito' });
```

## 4. Métricas de negocio basadas en eventos

| Evento dominio | Métrica | Tipo |
|----------------|---------|------|
| `OrderCompleted` | `orders_completed_total` | Counter |
| `OrderCompleted.total` | `orders_value_sum` | Counter |
| `ReturnRequested` | `returns_total` | Counter |

Fórmula PANEL → *GMV* (`orders_value_sum - returns_value_sum`).