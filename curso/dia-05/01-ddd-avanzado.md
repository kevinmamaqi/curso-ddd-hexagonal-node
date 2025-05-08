# Tema 4 - Aggregate Roots, Domain Events y Repositorios

## 1. Aggregate Root: Principios de diseño

1. **Gateway de consistencia**: toda modificación al cluster pasa por el Root.  
2. **Transacción local**: invariantes garantizadas antes de salir del método.  
3. **Tamaño sensato**: debe cargarse en memoria y guardarse con un round-trip a la BD.

| Correcto | Incorrecto |
|----------|------------|
| `Order` con Items como VO y métodos `addItem`, `pay` | `Customer` con 12 colecciones y reglas dispersas |

### 1.1 Reglas (Vernon crib sheet)

- Comunicarte con otras Aggregates por **ID**, nunca por referencia.  
- Preferir **inmutabilidad**: los métodos devuelven `void` pero mutan estado de forma controlada.

## 2. Domain Events

> “Captura lo significativo; expón la intención.”  

### 2.1 ¿Cuándo emitir?

- Cambio de estado que interese a otro contexto.  
- Superación de un *business rule* (ej. límite de crédito).  
- Inicio/fin de proceso largo.

### 2.2 Implementación mínima en Node

```ts
// domain/events/domain-event.ts
export interface DomainEvent<T extends string = string> {
  type: T;
  occurredAt: Date;
}

export abstract class AggregateRoot {
  private changes: DomainEvent[] = [];
  protected addEvent(e: DomainEvent) { this.changes.push(e); }
  pullEvents() { return this.changes.splice(0); }
}
```

```ts
// domain/order-paid.event.ts
export type OrderPaidPayload = { orderId: string; total: number };

export class OrderPaid implements DomainEvent<'OrderPaid'> {
  type = 'OrderPaid' as const;
  occurredAt = new Date();
  constructor(readonly payload: OrderPaidPayload) {}
}
```

```ts
// domain/order.aggregate.ts (extracto)
import { AggregateRoot } from '../events/domain-event';
import { OrderPaid } from '../events/order-paid.event';

export class Order extends AggregateRoot {
  pay() {
    if (this.status !== 'PENDING') throw new Error('Ya pagado');
    this.status = 'PAID';
    this.addEvent(new OrderPaid({ orderId: this.id, total: this.total() }));
  }
}
```

## 3. Repositorios como colecciones

```ts
export interface OrderRepositoryPort {
  save(order: Order): Promise<void>;
  byId(id: string): Promise<Order | null>;
  nextId(): string;
}
```

- **nextId()**: dominio no conoce generación de IDs.  
- **save()** persiste estado y, opcionalmente, publica eventos en la misma transacción (outbox).

## 4. Versionado optimista y concurrencia

```ts
// order table: id, data JSONB, version INT
UPDATE orders
SET data = $1, version = version + 1
WHERE id = $2 AND version = $3;
```

Si `rowCount === 0` → lanzar `ConcurrencyError`.

## 5. Patrón Factory

Cuando la creación implica reglas complejas, extrae a **Factory**:

```ts
export class OrderFactory {
  constructor(private readonly creditService: CreditPort) {}
  async create(customerId: string, items: DraftItem[]): Promise<Order> {
    if (!(await this.creditService.hasCredit(customerId))) {
      throw new Error('Sin crédito');
    }
    const order = Order.new(customerId);
    items.forEach(i => order.addItem(i.sku, i.qty, i.price));
    return order;
  }
}
```

## 6. Patrón Specification (reglas reusables)

```ts
export interface Specification<T> { isSatisfiedBy(candidate: T): boolean; }

export class StockAvailableSpec implements Specification<OrderItem> {
  constructor(private readonly stockRepo: StockPort) {}
  isSatisfiedBy(item: OrderItem) { return this.stockRepo.qty(item.sku) >= item.qty.value; }
}
```

Uso dentro de Aggregate o Service de dominio.

## 7. Checklist para tu dominio

- [ ] ¿Tus Aggregates caben en memoria (< 50 KB)?  
- [ ] ¿Toda regla de negocio viva en Entidades / VO / Services de dominio?  
- [ ] ¿Eventos nombrados con verbo pasado (`XxxOccurred`)?  
- [ ] ¿Repositorios devuelven Entities completas, no DTO?  

Practica: marca “sí/no” en tu PR.