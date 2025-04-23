# Sesión 7 · 14-may-2025  
## Objetivos y roadmap de la sesión

| Hora | Actividad | Resultado |
|------|-----------|-----------|
| 17 h 00-17 h 10 | Sincronizar sprint | PR de ayer revisados |
| 17 h 10-17 h 40 | **Event Sourcing avanzado** | Comprender append-only y versionado |
| 17 h 40-18 h 05 | **Patrón Outbox + Exactly-Once** | Diseño sin fantasías |
| 18 h 05-18 h 35 | **Saga/Process Manager** intro | Choreography vs Orchestration |
| 18 h 35-18 h 50 | Lab: `PayOrder` Saga inicial | Estado de saga en tabla |
| 18 h 50-19 h 00 | Concept Quiz 07 | Validación del aprendizaje |

### Metas de código

1. Persistir eventos `OrderPaid` y `StockReserved`.  
2. Outbox funcionando con deduplicación.  
3. Proyección `order_status` actualizada por Saga.  

*Dejar listo para la sesión 8 (EDA).*