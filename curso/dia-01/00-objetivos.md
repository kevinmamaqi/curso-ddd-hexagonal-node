# Sesión 1 · 05-may-2025  
**Duración:** 17 h 00 – 19 h 00 (UTC-5 / Colombia)  
**Tema global:** *Conceptos base – DDD, Arquitectura Hexagonal, CQRS y EDA*

---

## Objetivos del día

| # | Objetivo específico | Relevancia |
|---|---------------------|------------|
| 1 | Analizar por qué la complejidad creciente degrada la productividad del equipo. | Reconocer el problema es el primer paso para aplicar patrones de diseño con sentido. |
| 2 | Diferenciar con precisión **Dominio** y **Infraestructura** dentro de una solución Node.js. | Una separación nítida minimiza la deuda técnica y mejora la mantenibilidad. |
| 3 | Describir con argumentos qué resuelve cada enfoque (Hexagonal, DDD, CQRS, EDA) y cuáles son sus límites. | Aplicar la solución adecuada según el contexto evita sobre-ingeniería. |
| 4 | Identificar cuándo la adopción de un patrón añade más coste que valor. | Contribuye a decisiones arquitectónicas equilibradas y sostenibles. |
| 5 | Clonar el repositorio y ejecutar la pila básica (`docker-compose`) en local. | Se garantiza que todos los participantes parten de un entorno reproducible. |

---

## Agenda de la sesión

| Bloque | Contenido |
|--------|-----------|
| Bienvenida & Verificación de entorno | Clonado del repositorio y arranque de contenedores. |
| El problema de la complejidad | Análisis del diagrama “Big Ball of Mud” y sus consecuencias. |
| Panorama general de los patrones | Introducción conceptual a Hexagonal, DDD, CQRS y EDA. |
| Estado del arte de los microservicios en Node.js (2025) | Tendencias, librerías y buenas prácticas actuales. |
| Lanzar el proyecto | Ejecución de `docker-compose`, verificación de *health-checks* y exploración de endpoints. |
| Evaluación rápida | Quiz de preguntas de selección múltiple para afianzar conceptos. |

---

## Conceptos evaluados

- Definiciones de *Dominio* y *Modelo de Dominio*  
- Importancia del *Lenguaje Ubicuo*  
- Diferencias entre **Port** y **Adapter**  
- Naturaleza de *Command* y *Query* en CQRS  
- Contraste entre *Event Bus in-memory* y *Broker duradero*  
- Ventajas y compromisos de EDA frente a REST síncrono  
- Aplicación del *Single Responsibility Principle* en servicios

*(La respuesta a cada punto deberá poder expresarse en menos de 30 segundos.)*

---

## Relación con el Proyecto Evolutivo

En esta primera sesión se valida el entorno de desarrollo y se ejecuta la base sin modificar el código. Este punto de partida común permitirá construir, de forma incremental, la solución final a lo largo del curso.

---

## Requisitos técnicos

- Docker ≥ 24 y Docker Compose v2  
- Node.js 20 LTS + **npm 10**  
- Visual Studio Code con extensiones ESLint, Prettier y Docker  
- Al menos **3 GB** de RAM libre para contenedores (PostgreSQL, RabbitMQ y dos servicios)

---

## Bibliografía y recursos recomendados

### Artículos y blogs

| Tema | Enlace |
|------|--------|
| Arquitectura Hexagonal | <https://alistair.cockburn.us/hexagonal-architecture/> |
| DDD en la práctica | <https://martinfowler.com/tags/domain%20driven%20design.html> |
| CQRS & Event Sourcing en Node | <https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs> |
| EDA y resiliencia | <https://martinfowler.com/articles/201701-event-driven.html> |

### Documentación oficial

- **OpenTelemetry:** <https://opentelemetry.io/docs/instrumentation/js/>  
- **RabbitMQ Tutorials:** <https://www.rabbitmq.com/getstarted.html>  
- **Prisma ORM:** <https://www.prisma.io/docs/>

### Libros

1. **“Domain-Driven Design Distilled”** – Vaughn Vernon  
2. **“Patterns of Enterprise Application Architecture”** – Martin Fowler  
3. **“Learning Event-Driven Architecture”** – Hugh McKee  
4. **“Clean Architecture”** – Robert C. Martin (referencia comparativa)

