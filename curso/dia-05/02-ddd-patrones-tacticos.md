# Tema 4 (parte 4) — Patrones Tácticos Profundos de DDD

## 1. Value Objects avanzados

- **Inmutables**; componen otras VOs si es natural.  
- Sobrecarga de operadores vía métodos (`plus()`, `times()`).  
- Igualdad por valor (`equals(other: VO)`).

```ts
export class Money {
  private constructor(private readonly cents: number) {}
  static of(amount: number) { return new Money(Math.round(amount * 100)); }
  plus(other: Money) { return new Money(this.cents + other.cents); }
  greaterThan(other: Money) { return this.cents > other.cents; }
  equals(other: Money) { return this.cents === other.cents; }
  toDecimal() { return this.cents / 100; }
}
```

## 2. Domain Services

Usa un **Domain Service** cuando:

1. La operación afecta a más de una Entidad/Aggregate.  
2. No encaja naturalmente en ninguna Entidad.  
3. Requiere inyectar puertos externos.

```ts
export class PricingService {
  constructor(private readonly taxPolicyPort: TaxPolicyPort) {}
  finalPrice(base: Money, country: string): Money {
    const tax = this.taxPolicyPort.taxFor(country);
    return base.plus(tax);
  }
}
```

## 3. Factories vs Builders

| Patrón | Uso | Ejemplo |
|--------|-----|---------|
| **Factory** | Reglas de creación, dependencias externas | `OrderFactory` (ver archivo 01) |
| **Builder** | Crear objeto paso a paso en tests | `OrderBuilder` sólo en módulo de test |

## 4. Specifications

Permiten **componer reglas** reutilizables:

```ts
class AndSpec<T> implements Specification<T> {
  constructor(private left: Specification<T>, private right: Specification<T>) {}
  isSatisfiedBy(c: T) { return this.left.isSatisfiedBy(c) && this.right.isSatisfiedBy(c); }
}
```

```ts
const spec = new AndSpec(
  new StockAvailableSpec(stockRepo),
  new NotDiscontinuedSpec()
);
if (!spec.isSatisfiedBy(item)) throw new Error('Item inválido');
```

## 5. Patrón Domain Event Publisher interno

- Aggregate acumula eventos.  
- UseCase los **extrae** (`pullEvents()`) y delega publicación.  
- Con esto evitas dependencia de broker en dominio.

## 6. Anti-patrones a evitar

| Anti-patrón | Síntoma | Solución |
|-------------|---------|----------|
| **Entity-as-Service** | Entidad con puertos externos | Mover a Domain Service |
| **Massive VO** | Value Object con 20 métodos no relacionados | Divide en VO pequeños |
| **Hidden Dependency** | Entidad instancia `Date.now()` | Inyectar `ClockPort` |

## 7. Ejercicio práctico (45 min)

> **Dominio**: *Suscripción mensual*  
> **Service**: `billing-service`

Tareas:

1. VO `Period` (`start`, `end`, validación).  
2. Entity `Subscription` con métodos `renew()` y `expire()`.  
3. Domain Service `BillingCalculator` → `amountFor(subscription)`.  
4. Eventos `SubscriptionRenewed`, `SubscriptionExpired`.  

Commit: `feat(billing): rich subscription model`.

Entrega: subir PR antes del final de la sesión.