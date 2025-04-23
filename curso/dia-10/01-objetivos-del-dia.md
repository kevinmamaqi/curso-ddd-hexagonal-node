# Sesión 10 · 20-may-2025  
## Objetivos y agenda

| Hora | Actividad | Resultado |
|------|-----------|-----------|
| 17 h 00-17 h 10 | Sincronizar estado Sprint #5 | PRs finales revisados |
| 17 h 10-17 h 35 | **Conceptos clave de Observabilidad** | Traces, logs y métricas claros |
| 17 h 35-18 h 05 | **OpenTelemetry deep-dive** | Exporter OTLP + exemplars |
| 18 h 05-18 h 25 | **Dashboards con Prometheus + Grafana** | Panel de negocio en vivo |
| 18 h 25-18 h 45 | Hands-on: métrica de valor de carrito | PromQL correctamente |
| 18 h 45-18 h 55 | Concept Quiz 10 | Evaluación |
| 18 h 55-19 h 00 | Kick-off Tema VIII | Próximos pasos |

### Metas concretas

1. Exponer `cart_value_total` (histogram) desde `order-service`.  
2. Crear dashboard “Business KPIs” con panel de curva de valor medio.  
3. Configurar sampling 5 % traces + exemplars.  
4. Alert `order_latency_p99 > 1 s` a Slack (Webhook local).