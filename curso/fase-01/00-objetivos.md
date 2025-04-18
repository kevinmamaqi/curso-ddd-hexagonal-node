<!-- 00-intro.md -->

# Sesión 1 · 05‑may‑2025  
**Duración:** 17 h 00 – 19 h 00 (UTC‑5 / Colombia)  
**Tema global:** *Conceptos base – DDD, Arquitectura Hexagonal, CQRS y EDA*

---

## Objetivos del día

| # | Objetivo concreto | ¿Por qué importa? |
|---|-------------------|-------------------|
| 1 | Entender *de forma cruda* por qué la complejidad mata la productividad. | Sin dolor no hay cambio: ver el barro antes de hablar de patrones. |
| 2 | Distinguir claramente **Dominio** vs. **Infraestructura**. | La línea roja que evita la putrefacción del código. |
| 3 | Definir, con palabras propias, qué resuelve cada patrón (Hexagonal, DDD, CQRS, EDA) y qué *no* resuelve. | No vas a sobrediagnosticar si conoces los límites. |
| 4 | Reconocer cuándo **NO** usar el patrón. | Porque “usar martillo para todo” es caro. |
| 5 | Configurar el repo local, clonar y ejecutar el *compose* del proyecto base. | La práctica empieza hoy; el final del curso no es PowerPoint. |

---

## Agenda
| hora | Contenido |
|------|-----------|
| 17:00 | Bienvenida, setup de repo y contenedores |
| 17:15 | **El problema de la complejidad** – diagrama “Big Ball of Mud” |
| 17:35 | Introducción sin filtros a Hexagonal, DDD, CQRS y EDA |
| 18:15 | Resumen “Microservicios en Node.js” – estado del arte 2025 |
| 18:35 | *Hands‑on*: levantar `docker‑compose`, probar health‑checks |
| 18:55 | **Quizz + Evaluación** (10 preguntas rápidas) |

---

## Conceptos que aparecerán en la evaluación interna

- *Dominio*, *Modelo de Dominio*, *Lenguaje Ubicuo*
- **Port** vs. **Adapter**
- *Command* y *Query* en CQRS
- *In‑Memory Event Bus* vs. *Broker duradero* (RabbitMQ)
- Ventajas y costes de EDA frente a REST síncrono
- *Single Responsibility Principle* aplicado a servicios

*(Los alumnos deben poder contestar en < 30 seg cada uno)*

---

## Relación con el Proyecto Final

> Hoy se clona el repo y se arranca **sin cambiar código**.  
> Mañana crearemos el primer *port* HTTP de `inventory‑service`.

---

## Requisitos técnicos para hoy

- Docker ≥ 24, Compose v2
- Node 20 LTS, `npm` 10
- VS Code con plugins: ESLint, Prettier y Docker
- 3 GB de RAM libre (PostgreSQL + RabbitMQ + 2 services)

*Quien no lo tenga listo perderá tiempo valioso de pair‑programming.*

---

## Bibliografía mínima

- *Domain‑Driven Design Distilled* – Vernon  
- *Patterns of Enterprise Application Architecture* – Fowler  
- *Learning Event‑Driven Architecture* – Bellemare

---

**Siguiente archivo →** `01-hexagonal-ddd-cqrs-eda.md`