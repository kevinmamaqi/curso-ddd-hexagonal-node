# Tema 4 (parte 2) — Del Modelo Anémico al Modelo Rico

## 1. El problema del “Anemic Domain Model”

```ts
// anemic/orderModel.ts
export interface OrderRow {
  id: string;
  status: string;
  items: { sku: string; qty: number; price: number }[];
}

export const saveOrder = async (db, row: OrderRow) => db.insert('orders', row);
```

- **Dónde está la lógica?** En los servicios o, peor, en el controller.
- Difícil garantizar invariantes, probar reglas, refactorizar.

## 2. Refactor a un dominio rico "Rich Domain Model"

### 2.1 Value Object: `Quantity`

```ts
export class Quantity {
  private constructor(readonly value: number) {}
  static of(n: number) {
    if (!Number.isInteger(n) || n <= 0) throw new Error('Qty inválida');
    return new Quantity(n);
  }
}
```

### 2.2 Entity + Aggregate Root: `Order`

```ts
export class OrderItem {
  constructor(
    readonly sku: string,
    readonly qty: Quantity,
    readonly priceCents: number,
  ) {}
  subtotal() { return this.qty.value * this.priceCents; }
}

export class Order {
  private items: OrderItem[] = [];
  private _status: 'PENDING' | 'PAID' = 'PENDING';

  constructor(readonly id: string) {}

  addItem(sku: string, qty: number, price: number) {
    this.items.push(new OrderItem(sku, Quantity.of(qty), Math.round(price * 100)));
  }

  pay() {
    if (this._status !== 'PENDING') throw new Error('Ya pagado');
    this._status = 'PAID';
  }

  total() {
    return this.items.reduce((acc, it) => acc + it.subtotal(), 0) / 100;
  }

  get status() { return this._status; }
}
```

### 2.3 Puerto de Persistencia

```ts
export interface OrderRepositoryPort {
  save(order: Order): Promise<void>;
  byId(id: string): Promise<Order | null>;
}
```

La lógica de negocio vive **dentro** de `Order`. Los tests van directos al dominio.

## 3. Comparativa rápida

| Métrica | Modelo anémico | Modelo rico |
|---------|----------------|-------------|
| Invariantes | En controller o DB | Dentro de la entidad |
| Tests | Integración costosos | Unitarios rápidos |
| Refactor | Riesgo alto | Riesgo moderado |

## 4. Migración segura paso a paso

1. Crea entidades y VO en paralelo al modelo viejo.  
2. Escribe tests que cubran reglas.  
3. Adapta UseCases para usar la nueva API.  
4. Retira el modelo anémico cuando la cobertura sea ≥ 80 %.  

## 5. Ejercicio guiado (45 min en clase)

> **Dominio:** *Gestión de Devoluciones*  
> **Contexto:** `returns-service`

Tareas:

1. Entidad `ReturnRequest` (Aggregate Root) con estados `REQUESTED`, `APPROVED`, `DECLINED`.  
2. VO `Reason` con 3 valores válidos (`DAMAGED`, `NOT_AS_DESCRIBED`, `OTHER`).  
3. UseCase `CreateReturnRequest`.  
4. Adapter HTTP `POST /returns` → crea solicitud.  

Commit: `feat(returns): rich domain model`.

*(Se verificará con tests de aceptación mañana.)*