# Avance Proyecto Final – Sprint #3½

## Meta de hoy

- Introducir **CQRS light** en `order-service`.  
- Crear tabla `order_summary` + endpoint `GET /orders/:id/summary`.

### Tareas

| # | Servicio | Acción | Etiqueta |
|---|----------|--------|----------|
| 1 | order | Command `CreateOrder` con Rabbit outbox | `cqrs-create` |
| 2 | order | Projector `OrderCreated` → `order_summary` | `cqrs-summary` |
| 3 | order | Query handler + HTTP adapter | `cqrs-query` |

*Deadline:* fin de sesión 7.

> Consejo: partan equipos Command/Query y definan contracts primero (Pact).