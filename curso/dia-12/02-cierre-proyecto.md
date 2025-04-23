# Cierre del Proyecto Final – Checklist y Review

## 1. Revisión de código (Lightning Review)

| Rubro | Puntos a verificar | Resultado |
|-------|-------------------|-----------|
| Hexagonal | Dominio no importa nada de infraestructura | |
| DDD Táctico | Aggregates pequeños, VO inmutables | |
| CQRS | Commands ≠ Queries, read-model actualizado | |
| Event Bus | Outbox + idempotencia | |
| Observabilidad | Métricas + exemplars + alertas | |

Marca ✅, 🟡 o ❌ durante la revisión por pares.

## 2. Métricas de calidad

| Métrica | Umbral | Proyecto |
|---------|--------|----------|
| Coverage | ≥ 80 % | |
| Bugs SonarQube | 0 bloqueantes | |
| Ciclo CI | < 5 min | |
| Latencia p95 `/orders` | < 50 ms | |

> Si alguna métrica no pasa el umbral, crear issue *phase-II*.

## 3. Demo de referencia

1. **Create Order** → *Trace ID* visible en Grafana viz.  
2. **Pay Order** → Evento `OrderPaid` en Rabbit.  
3. **Reserve Stock** → Inventory métricas actualizadas.  
4. **Order Completed** → GMV dashboard suma valor.  
5. **Return Request** → Saga dispara alerta `returns_total`.

Demostración máxima: 5 min.

## 4. Retrospectiva KAKE

- **Keep**: Prácticas que funcionaron (p. ej., TDD en Aggregates).  
- **Add**: Nuevos experimentos (p. ej., Feature Flags).  
- **Kill**: Lo que no aportó (p. ej., doble inyección de logger).  
- **Experiment**: Hypothesis a testear (p. ej., gRPC vs REST).

Resultado → archivo `retro-kake-2025-05-22.md`.