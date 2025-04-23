# Sesión 9 · 19-may-2025  
## Objetivos y agenda

| Hora | Actividad | Resultado |
|------|-----------|-----------|
| 17 h 00-17 h 10 | Sincronizar backlog | Issues “eda-*” al día |
| 17 h 10-17 h 35 | **Manejo avanzado de errores** | Estrategias re-queue, poison queue |
| 17 h 35-18 h 00 | **Event Versioning live demo** | Up-caster en Inventory |
| 18 h 00-18 h 30 | **Monitoring & tracing de eventos** | Grafana dashboard + OpenTelemetry |
| 18 h 30-18 h 45 | Laboratorio: poison-pill scenario | Evento mal formado manejado sin caída |
| 18 h 45-18 h 55 | Concept Quiz 09 | Validación |
| 18 h 55-19 h 00 | Próximos pasos → Tema VII | Roadmap claro |

Metas técnicas:

1. Cola *poison* para eventos no parseables (`dead-letter.poison`).  
2. Up-caster activo (`v:1 → v:2`) sin reiniciar servicios.  
3. Métrica `event_processing_seconds` exportada por every consumer.