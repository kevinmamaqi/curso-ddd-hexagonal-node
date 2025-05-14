# Avance Proyecto Final – Sprint #4

## Objetivo hasta la sesión 8

- Terminar Saga de pago → orden completada.  
- Outbox consolidado en los 4 servicios principales.  
- Métrica `saga_failed_total` en Prometheus.

### Tareas clave

| # | Servicio | Issue GH | Done? |
|---|----------|----------|-------|
| 1 | payment | Process Manager publish `PaymentConfirmed` | |
| 2 | inventory | Consume `ReserveStockCmd`, emite `StockReserved` | |
| 3 | order | Escucha `StockReserved`, actualiza estado | |
| 4 | obs | Dashboard “Saga Flow” con panels de métricas | |

> Deadline: 15-may 23 h COL.  
> **Demo live de la saga** abre la sesión 8 (EDA).