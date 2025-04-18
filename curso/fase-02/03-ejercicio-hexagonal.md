# Lab · Implementar un microservicio Hexagonal “Catalog”

## Meta

Construir un servicio mínimo de **Catálogo de Productos** utilizando los conceptos vistos hoy.

## Requisitos funcionales

1. Registrar producto (`POST /products`) con `{ sku, name, price }`.  
2. Consultar producto (`GET /products/:sku`).  

## Requisitos técnicos

| Capas | Detalle |
|-------|---------|
| Dominio | `Product` (Entity) + `Money` (ValueObject) |
| Puertos | `ProductRepositoryPort` (salida) |
| Adaptadores | HTTP (entrada) + Postgres vía Prisma (salida) |
| Tests | Unitarios de dominio + adapter in‑memory |

## Pasos sugeridos (120 min)

1. Crear carpeta `catalog-service` replicando el esqueleto de `inventory-service`.  
2. Definir `Product` y `Money` en `src/domain`.  
3. Escribir test de `Product.total()` para validar precio * 1 (simple).  
4. Definir `ProductRepositoryPort` y un adapter in‑memory (`Map<string,Product>`).  
5. Crear `CreateProductUseCase` + `GetProductUseCase`.  
6. Construir handler Fastify `POST /products`.  
7. Sustituir adapter in‑memory por `PostgresProductRepository`.  
8. Añadir migración Prisma `Product` (`sku: PK, name, price INT`).  
9. Actualizar `docker-compose.yaml` para compilar `catalog-service`.  
10. Subir un PR con el tag `#hex-lab2`.

### Criterios de aceptación

- `npm test` pasa en CI.  
- `curl -XPOST .../products` devuelve `201` y `id`.  
- `curl .../products/:sku` devuelve JSON con los campos persistidos.

**Bonus:** Publicar evento `ProductCreated` en RabbitMQ.

---

> Recordatorio: el instructor hará *code‑review en vivo* de 1‑2 repos elegidos al azar mañana.