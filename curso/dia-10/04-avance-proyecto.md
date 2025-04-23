# Avance Proyecto Final – Sprint #6 (Observabilidad)

## Hitos antes de la sesión 11

1. `order-service` expone `order_latency_seconds` con exemplars.  
2. Prometheus scrapea 4 servicios y Alertmanager notifica a `/slack-test`.  
3. Dashboard “Business KPIs” importado en Grafana (`uid: biz-kpis`).  
4. Documento `observability-guide.md` describe pipelines métricas/traces/logs.

Checklist rápida:

| Servicio | Logs struct | Métricas | Traces |
|----------|-------------|----------|--------|
| order | ✅ | ✅ | ✅ |
| inventory | ✅ | ✅ | ✅ |
| payment | ✅ | ✅ | ✅ |
| analytics | ✅ | N/A | ✅ |

**Deadline:** 21-may-2025 15 h COL.