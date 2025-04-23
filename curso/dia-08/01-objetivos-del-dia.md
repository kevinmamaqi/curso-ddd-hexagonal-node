# Sesión 8 · 15-may-2025  
## Objetivos y agenda

| Hora | Actividad | Salida esperada |
|------|-----------|-----------------|
| 17 h 00-17 h 10 | Sincronizar estado de Saga | Todos con demo funcionando |
| 17 h 10-17 h 40 | **EDA fundamentos** | Comprender Event Brokers & Streams |
| 17 h 40-18 h 15 | **EDA en Node.js (RabbitMQ live-coding)** | Publicar/consumir con confirmSelect |
| 18 h 15-18 h 40 | **Errores y retries** | Estrategia back-off + DLX lista |
| 18 h 40-18 h 50 | Hands-on: fan-out de `OrderCompleted` | Dos servicios escuchan correctamente |
| 18 h 50-19 h 00 | Quiz #08 | Validación rápida |

Metas técnicas concretas:

1. Publicar `OrderCompleted` a exchange tipo **fanout**.  
2. Inventory y Analytics se suscriben con sus propias colas.  
3. Implementar **retry con back-off exponencial** y Dead-Letter Exchange (DLX).  
4. Versionar evento (`v:2`) sin romper consumidores antiguos.