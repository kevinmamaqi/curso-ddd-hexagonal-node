# Tema VII (parte 2) — Instrumentación y Dashboards

## 1. Exportar métricas a Prometheus

```ts
import { MeterProvider } from '@opentelemetry/sdk-metrics';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

const exporter = new PrometheusExporter({ port: 9464 }, () => console.log('➡️  Metrics at :9464'));
const meterProvider = new MeterProvider({ exporter, interval: 1000 });
```

Scrape config en `prometheus.yml`:

```yaml
  - job_name: order-service
    static_configs:
      - targets: ['order-service:9464']
```

## 2. Histogram + exemplars

```ts
const latency = meter.createHistogram('order_latency_seconds', {
  unit: 's',
  description: 'Duración de /orders POST',
});

app.post('/orders', async (req, res) => {
  const end = latency.startTimer();
  // … lógica …
  end({ trace_id: trace.getSpan(context.active()).spanContext().traceId });
});
```

Grafana 10 muestra exemplar como punto en la barra.

## 3. Alerting simple

```yaml
groups:
- name: order-latency
  rules:
  - alert: P99High
    expr: histogram_quantile(0.99, sum by (le)(rate(order_latency_seconds_bucket[5m]))) > 1
    for: 2m
    labels:
      severity: high
    annotations:
      summary: "Latencia p99 alta"
      description: "p99 order_latency_seconds > 1s"
```

Webhook Alertmanager → Slack incoming webhook.

## 4. Dashboard “Business KPIs”

| Panel | PromQL |
|-------|--------|
| **GMV Diario** | `sum(increase(orders_value_sum[1d])) - sum(increase(returns_value_sum[1d]))` |
| **Órdenes / min** | `rate(orders_completed_total[5m])` |
| **Valor medio carrito** | `sum(increase(orders_value_sum[1h])) / sum(increase(orders_completed_total[1h]))` |
| **Errores 5xx** | `rate(http_server_errors_total[5m])` |

Export `dashboard.json` al repo.