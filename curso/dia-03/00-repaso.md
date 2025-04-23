# Sesión 3 · 07-may-2025  
## Repaso exprés de la Sesión 2

Antes de profundizar en TEMA 3 (continuación de Arquitectura Hexagonal), conviene echar un vistazo rápido a los aprendizajes y “tareas de brillo” que dejamos listos.

Tema                   | Insight clave                                                      | Acción inmediata
----------------------|--------------------------------------------------------------------|---------------------------------------------------------------
Ports & Adapters      | Definimos puertos muy específicos (1–3 métodos) y adaptadores finos | Revisa tu código: ¿algún handler HTTP mezcla validaciones o reglas de negocio? Si es así, trasládalas a un Use Case.
DI / Awilix           | El container se inyecta desde el arranque, nunca se importa global | Abre tus módulos de dominio y busca llamadas a `container.resolve` – deben estar solo en la capa de infraestructura o en main.ts.
Hexagonal vs. Onion   | Hexagonal es asimétrico (puertos vs. adaptadores); Onion usa capas concéntricas | En tu monolito legacy, discute cuándo te convendría más cada enfoque: ¿prefieres simetría o centralidad de dominio?


Con estas premisas en mente estamos listos para seguir desglosando puertos, adaptadores y patrones que sostienen un servicio robusto y mantenible.