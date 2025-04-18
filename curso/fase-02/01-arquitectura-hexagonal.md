# Tema 3 (parte 1) — Arquitectura Hexagonal · Fundamentos y Beneficios

> *Objetivo:* entender **por qué** y **cuándo** usar el patrón, no solo el *cómo*.

## 1. Génesis del patrón

- Propuesto por **Alistair Cockburn** (2005) para aislar la lógica del dominio de las tecnologías externas que cambian más rápido.  
- También llamado **“Ports & Adapters”**.

## 2. Principios clave

| Principio | Explicación | Impacto práctico |
|-----------|------------|------------------|
| **Independencia del dominio** | El núcleo no depende de frameworks, DB drivers ni SDKs. | Refactor más barato; tests ultra rápidos. |
| **Puertos explícitos** | Interfaces que declaran los puntos de entrada/salida. | Contratos claros; menos *API creep*. |
| **Adapters intercambiables** | Implementaciones de puertos conectan tecnología ↔ dominio. | Swap Mongo → Postgres sin tocar dominio. |
| **Inversión de dependencias (DIP)** | El dominio *define* la abstracción; la infra la *implementa*. | El código de negocio manda, no la BD. |

## 3. Comparativa rápida

| Dimensión | **Hexagonal** | **Onion** | **Clean Architecture** |
|-----------|--------------|-----------|------------------------|
| Núcleo | Dominio + Aplicación | Dominio en centro absoluto | Entidades empresariales |
| Capas | Asimétricas (entrada/salida) | Concentricidad | Concéntrica + políticas |
| Enfoque | Aislamiento tecnológico | Pureza de dominio | Casos de uso |
| Complejidad inicial | Media | Alta | Alta |
| Ideal para | Microservicios que necesitan adaptarse de forma incremental | Dominios ricos con reglas complejas | Sistemas grandes, multi‑UI |

*Conclusión:* Para microservicios en Node, Hexagonal ofrece la mejor relación coste‑beneficio: te da límites claros sin una sobrecarga ceremoniosa. Referencia de [hexagonal vs clean architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html).

## 4. Beneficios en microservicios

1. **Evolutividad:** Añadir gRPC o GraphQL sin tocar el core.  
2. **Testabilidad:** 95 % de cobertura sin levantar contenedores.  
3. **Observabilidad limpia:** Logs y métricas se inyectan vía adapters, no ensucian el dominio.  
4. **Refactoring reversible:** Cambiar de ORM no requiere migrar reglas de negocio.

## 5. Aplicación en Node.js

- **Ventaja asíncrona:** Los adapters de salida suelen ser I/O (DB, MQ) → el event loop los maneja bien.  
- **TypeScript interfaces** = puertos naturales.  
- **DI containers** como **awilix** o **tsyringe** permiten *constructor injection* sin magia.

```ts
// src/application/container.ts
import { asClass, asFunction, createContainer } from 'awilix';
import { PostgresUserRepository } from '../infrastructure/postgres/user-repository.postgres';
import { RabbitEventBus } from '../infrastructure/rabbit/rabbit.event-bus';
import { RegisterUserUseCase } from './use-cases/register-user.usecase';

export const container = createContainer({
  injectionMode: 'CLASSIC',
});

container.register({
  userRepository: asClass(PostgresUserRepository).scoped(),
  eventBus: asClass(RabbitEventBus).scoped(),
  registerUserUseCase: asClass(RegisterUserUseCase).scoped(),
});
```

## 6. Síntomas de mal uso

- *Adapter* con más líneas de negocio que el *UseCase*.  
- Dominio importando `axios` directamente.  
- Tests de dominio que requieren Docker para pasar.

**Regla de oro:**  
> *Si el test de dominio necesita un contenedor, tu hexágono tiene un agujero.*

## 7. Próximo paso

En el siguiente archivo profundizaremos en **puertos y adaptadores** con código real.