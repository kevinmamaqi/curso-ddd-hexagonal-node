# Avance Proyecto Final

## Qué haremos hasta la sesión 6 (13-may)

| Objetivo | Servicio | Issue GH |
|----------|----------|----------|
| Emitir `OrderPaid` | order | `order-payment` |
| Proyección `order_read` | order | `order-read` |
| Actualizar stock | inventory (suscribe `OrderPaid`) | `inventory-stock` |
| Métrica Prometheus `orders_paid_total` | observabilidad | `obs-metric` |

### Criterios de done

- Pago manual (`curl POST /orders/:id/pay`) genera evento y actualiza proyección.  
- Inventory devuelve stock descontado en < 1 s.  
- `curl /metrics` expone `orders_paid_total` > 0 tras prueba e2e.

**Showcase**: inicio sesión 6 (live).

> Trabajad en parejas: un equipo comando, otro proyección.