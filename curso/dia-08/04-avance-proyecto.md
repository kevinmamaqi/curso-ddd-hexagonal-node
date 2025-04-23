# Avance Proyecto Final – Sprint #5

## Meta hasta la sesión 9

1. Exchange `domain` tipo fanout creado.  
2. Evento `OrderCompleted` (`v:2`) publicado desde Process Manager.  
3. **Inventory Service** actualiza stock histórico.  
4. **Analytics Service** incrementa métrica `orders_completed_total`.  
5. Retry con back-off y DLX `dead-letter` funcionando.

### Tareas

| # | Servicio | Issue GH |
|---|----------|----------|
| 1 | order | Publish `OrderCompleted` (fanout) | `eda-order` |
| 2 | inventory | Handler `OrderCompleted` → ajuste stock | `eda-inv` |
| 3 | analytics | Nuevo servicio listener + Prom metrics | `eda-ana` |
| 4 | infra | DLX + TTL config script | `eda-dlx` |

**Deadline**: 19-may-2025 12 h COL.