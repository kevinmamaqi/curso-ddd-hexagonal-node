# Tema VIII (parte 1) — Lecciones aprendidas

| Área | Principales insights | Anti-patrón detectado |
|------|----------------------|-----------------------|
| Arquitectura Hexagonal | Dominio sin frameworks → tests rápidos. | Adaptadores gordos (“Fat Handler”). |
| DDD táctico | VO + Aggregates reducen bugs. | Entidades anémicas revivieron en algunos PR. |
| CQRS | Lecturas 6× más rápidas con `order_summary`. | Over-engineering en CRUD sencillos. |
| Event Sourcing | Historial auditable, fácil re-play. | Falta de estrategia de versionado inicial. |
| EDA | Escalabilidad horizontal sin dolor. | Retries sin DLX = tormenta de mensajes. |
| Observabilidad | GMV diario visible en 1 gráfica. | Falta de logs estructurados al principio. |

## Tabla “Before / After”

| Métrica | Semana 1 | Semana 3 | Mejora |
|---------|----------|----------|--------|
| Latencia p95 `/orders` | 220 ms | 32 ms | 6.8× |
| Cobertura tests | 12 % | 84 % | +72 pp |
| GMV dashboard | N/A | 100 % activo | ✔︎ |
| Incidentes 5xx (lab) | 7 | 1 | −86 % |

## Reflexión

> *Complejidad inevitable ≠ complejidad accidental.*  
> Cada patrón aplicado eliminó deuda técnica futura a costa de disciplina hoy.