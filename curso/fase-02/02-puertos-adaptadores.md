# Tema 3 (parte 2) — Puertos y Adaptadores en detalle

## 1. Taxonomía

| Tipo | Alias | Quién lo define | Ejemplos |
|------|-------|----------------|----------|
| **Puerto de Entrada** | Driving / Primary | Capa de aplicación | `RegisterUser`, `GetOrderQuery` |
| **Puerto de Salida**  | Driven / Secondary | Capa de aplicación | `UserRepository`, `PaymentGateway` |
| **Adapter de Entrada** | Controller | Infraestructura (HTTP, CLI) | `FastifyHandler`, `GraphQLResolver` |
| **Adapter de Salida**  | Gateway | Infraestructura (DB, MQ, API) | `PostgresUserRepository`, `StripeAdapter` |

![hexagonal-layers](https://raw.githubusercontent.com/ddd-visuals/hexagon-diagram/main/hexagon.svg)

*(Diagrama externo, CC‑BY)*

## 2. Nodo de ejemplo: `PaymentGatewayPort`

```ts
// dominio
export interface PaymentGatewayPort {
  charge(amount: number, currency: string): Promise<{ receiptId: string }>;
}
```

```ts
// adapter externo (Stripe)
export class StripePaymentGateway implements PaymentGatewayPort {
  constructor(private readonly client = new Stripe(process.env.STRIPE_KEY!)) {}

  async charge(amount: number, currency: string) {
    const r = await this.client.charges.create({ amount, currency });
    return { receiptId: r.id };
  }
}
```

## 3. Organización del proyecto Node.js

```
src/
├── domain/
│   ├── entities/
│   ├── value-objects/
│   └── events/
├── application/
│   ├── ports/             ← interfaces (in/out)
│   ├── use-cases/
│   └── services/          ← domain services recolectados
├── infrastructure/
│   ├── http/              ← adapters de entrada
│   ├── postgres/          ← adapters de salida
│   └── rabbit/
└── main.ts                ← boot + DI container
```

## 4. Inversión de Dependencias (DIP) en Node

```ts
// src/main.ts
import { container } from './application/container';
import { buildServer } from './infrastructure/http/server';

(async () => {
  const app = buildServer(container);
  await app.listen({ port: 3000 });
})();
```

**No** uses un *service locator* global; pasa el contenedor explícitamente.

## 5. Anti‑patrones

| Anti‑patrón | Por qué es peligroso | Alternativa |
|-------------|---------------------|-------------|
| *Fat Adapter* | Duplica lógica, difícil de testear | Extraer UseCase |
| *Domain HUD* | Dominio haciendo logging/tracing directo | Inyectar `LoggerPort` |
| *Anonymous Interface* | Usar `any` como puerto | Definir interfaces typed |

## 6. Buenas prácticas

1. **Puertos = interfaces pequeñas** — 1‑3 métodos.  
2. **Adapters *thin*** — validación + mapeo + llamada a puerto.  
3. **UseCases orquestan; Domain ejecuta reglas**.

## 7. Ejemplo de test de contrato (Consumer‑Driven)

```ts
import { pactWith } from 'jest-pact';
import { FastifyInstance } from 'fastify';
import { buildServer } from '../../src/infrastructure/http/server';

pactWith({ consumer: 'OrderAPI', provider: 'OrderService' }, (provider) => {
  let app: FastifyInstance;

  beforeAll(() => {
    app = buildServer(/* container stub */);
    provider.addInteraction({
      state: 'no orders',
      uponReceiving: 'a request for orders',
      withRequest: { method: 'GET', path: '/orders' },
      willRespondWith: { status: 200, body: [] },
    });
  });

  it('GET /orders returns []', async () => {
    await provider.executeTest(async () => {
      const res = await app.inject({ method: 'GET', url: '/orders' });
      expect(res.statusCode).toBe(200);
    });
  });
});
```

**Ventaja:** Garantiza que el *adapter de entrada* cumple con su contrato HTTP sin tocar dominio ni infra reales.