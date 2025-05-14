# Sesión 7 · 14-may-2025  
## Objetivos y roadmap de la sesión

- Sincronizar sprint: PR de ayer revisados  
- **Event Sourcing avanzado**: Comprender append-only y versionado  
- **Patrón Outbox + Exactly-Once**: Diseño sin fantasías  
- **Saga/Process Manager** intro: Choreography vs Orchestration  
- Lab: `PayOrder` Saga inicial: Estado de saga en tabla  
- Concept Quiz 07: Validación del aprendizaje  

### Metas de código

1. Persistir eventos `OrderPaid` y `StockReserved`.  
2. Outbox funcionando con deduplicación.  
3. Proyección `order_status` actualizada por Saga.  

*Dejar listo para la sesión 8 (EDA).*  