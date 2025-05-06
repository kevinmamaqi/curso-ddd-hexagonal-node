# 03-buenas-practicas · Hexagonal Avanzado y DIP

**Objetivo:** incorporar patrones de inyección de dependencias sólidos, reducir código boilerplate y facilitar pruebas predecibles sin comprometer la claridad del diseño.

---

## 1. Principio de Hollywood

> “Don’t call us, we’ll call you.”

El dominio **declara** qué necesita (interfaces/puertos), la infraestructura **implementa** esos puertos. Así el core no hace `new SystemClock()`, sino que recibe un `ClockPort`.

Ejemplo:

```ts
// src/domain/ports/ClockPort.ts
export interface ClockPort {
  now(): Date;
}

// src/infrastructure/clock/SystemClock.ts
import { ClockPort } from "../../domain/ports/ClockPort";
export class SystemClock implements ClockPort {
  now() {
    return new Date();
  }
}
```

```ts
// src/application/use-cases/GenerateInvoiceUseCase.ts
import { ClockPort } from "../../domain/ports/ClockPort";
export class GenerateInvoiceUseCase {
  constructor(private readonly clock: ClockPort) {}
  execute() {
    const issuedAt = this.clock.now();
    return { invoiceId: "INV-" + Date.now(), issuedAt };
  }
}
```

**Test sencillo** con reloj fijo:

```ts
class FixedClock implements ClockPort {
  now() {
    return new Date("2025-05-07T12:00:00Z");
  }
}
```

```ts
// tests/unit/GenerateInvoiceUseCase.spec.ts
import { GenerateInvoiceUseCase } from "../../src/application/use-cases/GenerateInvoiceUseCase";
describe("GenerateInvoiceUseCase", () => {
  it("usa el reloj inmutable en tests", () => {
    const uc = new GenerateInvoiceUseCase(new FixedClock());
    const result = uc.execute();
    expect(result.issuedAt.toISOString()).toBe("2025-05-07T12:00:00.000Z");
  });
});
```

---

## 2. Constructor vs. Setter injection

| Estilo          | Pros                                                          | Contras                                                         |
| --------------- | ------------------------------------------------------------- | --------------------------------------------------------------- |
| **Constructor** | - Dependencias explícitas<br>- Objeto inmutable tras creación | - Firmas de constructor largas si hay muchas deps               |
| **Setter/Prop** | - Firmas limpias<br>- Permite cambiar deps en runtime         | - Riesgo de uso antes de inyección<br>- Tests menos predecibles |

> **Recomendación:** usa siempre **constructor injection** con Awilix en modo CLASSIC; el código queda más explícito y fácil de testear.

---

## 3. Service Locator ≠ Dependency Injection

- **Service Locator**: metes un `Locator.get('repo')` donde sea → oculta dependencias, dificulta entender qué necesita cada clase.
- **DI explícita**: pasas todo por constructor o método de fábrica → cada clase documenta sus deps y los tests pueden reemplazarlas fácilmente.

---

## 4. Null Object & Optional Ports

Si un puerto no es crítico (por ejemplo, `AnalyticsPort`), crea un adapter nulo para entornos de desarrollo o tests:

```ts
// src/domain/ports/AnalyticsPort.ts
export interface AnalyticsPort {
  track(event: string, payload: any): void;
}
```

```ts
// src/infrastructure/analytics/NullAnalytics.ts
import { AnalyticsPort } from "../../domain/ports/AnalyticsPort";
export class NullAnalytics implements AnalyticsPort {
  track(event: string, payload: any) {
    // no-op
  }
}
```

Regístralo como fallback en tu container para evitar `undefined` en producción y desarrollo:

```ts
container.register({
  analytics: asClass(NullAnalytics).singleton(),
});
```

---

## 5. Módulos barril (`index.ts`) solo en Infraestructura

- Evita exponer todo tu dominio a través de un solo `src/domain/index.ts`.
- Usa barriles **solo** para agrupar adapters en `infrastructure/`:

```ts
// src/infrastructure/index.ts
export * from "./postgres/InventoryRepositoryPostgres";
export * from "./http/inventory-routes";
```

Así mantienes el **encapsulamiento** del dominio y evitas dependencias circulares.

---

**Referencias**

- Fowler, M. “Inversion of Control Containers and the Dependency Injection pattern” – https://martinfowler.com/articles/injection.html
- Awilix Documentation – https://github.com/jeffijoe/awilix#readme
