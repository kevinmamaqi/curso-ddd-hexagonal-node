# Avance Proyecto Final – Sprint #1 (30 min en sesión + trabajo en casa)

## Objetivo de hoy

- Completar la infraestructura de `invenory-service`.
- Levantar el servicio, probarlo y dejarlo corriendo.
- Avanzar en la implementación de `order-service`, siguiendo como ejemplo el código de `inventory-service`.
- Levantar el servicio, probarlo y dejarlo corriendo.
- Intentar avanzar en la implementación de los clientes.

---

# Order Services

# 05-avance-proyecto · Order Service – Sesión 3

En este servicio de dominio de pedidos, el Order Service se encarga exclusivamente de gestionar la creación y consulta de órdenes. No realiza llamadas directas al inventory-service; la orquestación (reservar stock y luego crear la orden) corresponde a la API cliente o API Gateway. De este modo, el Order Service permanece puro y centrado en su modelo de dominio.

Objetivo de la práctica (1 hora):

- Reforzar la arquitectura hexagonal definiendo datos, peticiones y respuestas
- Enfocar el servicio sólo en su responsabilidad core: procesar órdenes

Descripción de datos y peticiones:

Modelo Order:

- orderId: string (UUID generado en backend)
- status: string enum \["PENDING", "CONFIRMED", "CANCELLED"]
- createdAt: ISO-8601 timestamp
- items: OrderItem\[]

Modelo OrderItem:

- sku: string (ej. "SKU-12345")
- quantity: number (entero positivo)

**POST /orders**

- Body JSON:

  ```json
  {
    "items": [
      { "sku": "ABC-001", "quantity": 2 },
      { "sku": "XYZ-123", "quantity": 1 }
    ]
  }
  ```

- Validaciones:
  • items debe existir y no estar vacío
  • sku no puede estar vacío y debe coincidir con /^\[A-Z0-9-]+\$/
  • quantity > 0

- Flujo interno del Order Service:

  1. Parsear y validar payload
  2. Crear entidad Order con status="PENDING", asignar orderId y createdAt
  3. Persistir Order en base de datos
  4. Responder 201 Created con { orderId, status, createdAt }

- Flujo externo (API cliente, fuera de este servicio):

  1. Llamar a inventory-service POST /inventory/reserve por cada ítem
  2. Si todas las reservas OK, invocar POST /orders al Order Service
  3. Si alguna reserva falla, abortar y devolver 409 Conflict al cliente

- Respuesta 201 Created:

  - Header Location: /orders/{orderId}
  - Body:
    ```json
    {
      "orderId": "550e8400-e29b-41d4-a716-446655440000",
      "status": "PENDING",
      "createdAt": "2025-05-07T10:15:30.000Z"
    }
    ```

  ```

  ```

**GET /orders/\:orderId**

- Parámetro de ruta: orderId (UUID)

- Flujo interno:

  1. Validar formato de orderId
  2. Recuperar Order desde repositorio
  3. Si no existe, responder 404 Not Found
  4. Mapear Order a DTO y devolver 200 OK

- DTO 200 OK:

  ```json
  {
    "orderId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "PENDING",
    "createdAt": "2025-05-07T10:15:30.000Z",
    "items": [
      { "sku": "ABC-001", "quantity": 2 },
      { "sku": "XYZ-123", "quantity": 1 }
    ]
  }
  ```

**Errores comunes**

| HTTP | Código interno  | Mensaje                     |
| ---- | --------------- | --------------------------- |
| 400  | INVALID_PAYLOAD | Datos de petición inválidos |
| 404  | ORDER_NOT_FOUND | Pedido no encontrado        |
| 500  | INTERNAL_ERROR  | Error interno del servidor  |

**Notas de arquitectura hexagonal**

- Puertos de persistencia (domain/ports):
  • OrderRepositoryPort { save(order), findById(orderId) }
- Use-cases (application/use-cases):
  • CreateOrderUseCase (valida y persiste)
  • GetOrderUseCase (recupera y mapea)
- Adaptadores:
  • PrismaOrderRepository (implements OrderRepositoryPort)
  • HttpInbound (routes y controllers que exponen los endpoints)
- DI y arranque (main.ts):
  • PrismaClient singleton
  • Repositorio scoped
  • Inyección en use-cases con contenedor DI

Con esta definición, los alumnos podrán crear primero los DTOs y validaciones, luego el repository con Prisma, y finalmente los controladores HTTP, manteniendo el Order Service puro y desacoplado de otros servicios.
