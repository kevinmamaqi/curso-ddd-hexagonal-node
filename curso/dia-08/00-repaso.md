# Sesión 8 · 15-may-2025

## Repaso exprés de la Sesión 7

| Concepto clave                            | ¿Qué vimos?                                                                                                                                                                 |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Event Sourcing**                        | Modelo donde el estado de una entidad se reconstruye a partir de eventos almacenados en orden cronológico. Se introdujo la idea de que los eventos son la fuente de verdad. |
| **Outbox Pattern**                        | Técnica para garantizar la publicación fiable de eventos desde la base de datos, usando una tabla `outbox` y un proceso que los envía de forma asíncrona.                   |
| **Process Manager (o Saga orchestrator)** | Componente que coordina pasos de largo recorrido entre servicios, manteniendo el estado de la Saga y reaccionando a eventos como `PaymentConfirmed` o `OrderCompleted`.     |
| **Métricas en Sagas**                     | Explicamos cómo instrumentar métricas como `saga_failed_total` para monitorear fallos en la ejecución distribuida de pasos.                                                 |
| **Migración hacia eventos**               | Cómo transicionar lógica existente basada en comandos o estados a un enfoque basado en eventos, incluyendo migraciones históricas o parciales.                              |
| **Estados intermedios en la Saga**        | Definición y gestión de estados como `OrderCreated`, `AwaitingPayment`, `InventoryReserved`, útiles para el seguimiento de la orquestación.                                 |
| **Errores y compensaciones**              | Tipos de fallos en Sagas y estrategias para compensarlos (undo/compensating actions), resaltando la necesidad de diseño explícito para el fracaso.                          |
| **Reintentos en entrega de eventos**      | Introducción al concepto de retry/back-off y su papel en garantizar la eventual consistencia ante errores temporales en la entrega de eventos.                              |

