# Sesión 11 · 21-may-2025  
## Repaso exprés de la Sesión 10

Objetivos generales
Comprender los fundamentos de la observabilidad, cómo instrumentar aplicaciones Node.js con OpenTelemetry y usar Grafana, Loki y Prometheus para monitorear, depurar y analizar microservicios.

Tool-chain básica
- **Prometheus**: TSDB pull-based para métricas y consultas con PromQL
- **Grafana**: UI unificada para dashboards, alertas y exploración de métricas/logs/trazas
- **Loki**: almacenamiento de logs indexados por etiquetas
- **Tempo**: almacén de trazas distribuido (OTLP nativo)
- **OpenTelemetry (OTEL)**: estándar vendor-neutral (API, SDK, spec)
- **Promtail**: agente para enviar logs a Loki
- **OTEL Collector (opcional)**: proxy para procesar y reenviar telemetría
- **Docker Compose**: orquestador local del stack

Fundamentos de observabilidad
- Distinción entre monitoreo clásico (“sabes qué preguntar”) y observabilidad moderna (“puedes explorar preguntas nuevas sin redeploy”).
- Importancia en microservicios: reducción de MTTR, detección de “unknown unknowns”.
- Los tres pilares
  - Logs: eventos discretos y estructurados, niveles (INFO/WARN/ERROR), contexto (IDs de correlación).
  - Métricas: contadores, histogramas, percentiles (P95/P99), usadas para dashboards y alertas.
  - Trazas: spans que muestran el flujo de solicitudes, con traceId/spanId, para identificar cuellos de botella.

Práctica
- Levantamos el stack completo vía Docker Compose.
- Probamos endpoints de Prometheus, Grafana y Loki.
- Generamos logs de ejemplo con un script TS y los visualizamos en Grafana.
- Instrumentación con OpenTelemetry en Node.js
- Instalación de paquetes OTEL (API, SDK, auto-instrumentaciones, exporters).
- Configuración de tracing.ts y arranque del SDK (spans y métricas).
- Uso de trazas automáticas y manuales en endpoints /fast y /slow.
- Métricas de negocio y dashboards
- Definición de métricas GOLD (Latency, Errors, Traffic, Saturation) y KPIs del dominio (p. ej. conversiones, órdenes).
- Creación de contadores e histogramas custom en el código.
- Scraping de métricas OTEL por Prometheus y paneles básicos en Grafana.
