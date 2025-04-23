# Sesión 6 · 13-may-2025  
## Objetivos y panorama del día

| Hora estimada | Actividad | Resultado esperado |
|---------------|-----------|--------------------|
| 17 h 00-17 h 10 | Bienvenida + estado del sprint | Todos los contenedores levantados, CI verde |
| 17 h 10-17 h 35 | **Conceptos clave de CQRS** | Entender Command vs Query, beneficios y límites |
| 17 h 35-18 h 15 | **CQRS en Node.js** (live-coding) | Estructura mínima y patrones de validación |
| 18 h 15-18 h 50 | **Hands-on lab** – implementar *CreateOrder* | Command handler persiste eventos, tests pasan |
| 18 h 50-19 h 00 | Concept Quiz 06 | Chequeo rápido de aprendizaje |

---

## Metas técnicas concretas

1. **Diferenciar** claramente los modelos de **lectura** y **escritura**.  
2. Levantar un **Event Store** en Postgres y registrar el primer evento `OrderCreated`.  
3. Construir la **proyección** `order_summary` y exponerla vía endpoint HTTP.  
4. Integrar **middleware de validación** con Zod para Commands.  
5. Dejar el proyecto listo para completar el Query Side en la sesión 7.

---

## Conceptos que aparecerán en la evaluación

- Definición formal de **Command** y **Query**.  
- Ventajas de un **read-model desnormalizado**.  
- Relación entre **Event Sourcing** y CQRS (complemento, no requisito).  
- Riesgos de mezclar lógica de validación en proyección.  
- Patrón **Outbox** para publicación de eventos confiable.

*Si puedes explicar cada punto en ≤ 30 seg, vas por buen camino.*

---

## Entregables mínimos antes de salir

- PR con tag `cqrs-create` abierto y pasando CI.  
- Tabla `event_store` creada y con al menos un evento.  
- Evidencia (screenshot) del endpoint `GET /orders/<id>/summary` devolviendo JSON.

---

> **Recuerda:** La complejidad de CQRS se paga en disciplina. Hoy sientas las bases; mañana las escalas.