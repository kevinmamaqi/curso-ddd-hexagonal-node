# Sesión 3 · 07-may-2025  
## Tema 3 (parte 2) — Arquitectura Hexagonal Avanzada y Testing

**Objetivo:** finalizar la estructura hexagonal de `inventory-service`, dominar ciclos de vida de dependencias y asegurar calidad con tests unitarios y de integración.

---

## 1. Preparación y verificación preliminar

### 1.1 Asegúrate de haber completado la Sesión 2:  
- El servicio compila (`npm run build`) y arranca (`npm run dev`) sin errores.  
- Prisma está configurado y la tabla `Inventory` existe en tu base de datos.  

### 1.2 Abre el proyecto en tu IDE y confirma que la estructura de carpetas es similar a la siguiente:

```
project/services/inventory-service/  
├── src/  
│   ├── domain/  
│   │   ├── model/  
│   │   └── ports/  
│   ├── application/  
│   │   ├── use-cases/  
│   │   └── container.ts  
│   ├── infrastructure/  
│   │   ├── http/  
│   │   ├── postgres/  
│   │   └── in-memory/  
│   └── main.ts  
├── tests/  
│   ├── unit/  
│   └── integration/  
├── prisma/  
│   ├── schema.prisma  
│   └── migrations/  
├── package.json  
├── tsconfig.json  
└── Dockerfile
```

---

## 2. Scopes y ciclo de vida en el contenedor DI (Awilix)

En `src/application/container.ts` vamos a registrar tres tipos de dependencias:

- **singleton()** para objetos globales:  
  - PrismaClient  
  - Configuración  

- **scoped()** para repositorios y casos de uso:  
  - InventoryRepositoryPostgres  
  - ReserveStockUseCase  

- **transient()** para objetos de prueba o stateful temporales:  
  - InMemoryInventoryRepository

Ejemplo de registro:

```ts
export const container = createContainer({ injectionMode: 'CLASSIC' })

container.register({  
  prisma: asClass(PrismaClient).singleton(),  
  inventoryRepo: asClass(InventoryRepositoryPostgres).scoped(),  
  inMemoryRepo: asClass(InMemoryInventoryRepository).transient(),  
  reserveUseCase: asClass(ReserveStockUseCase).scoped()  
})
```

**Por qué importa:** usar los scopes adecuados garantiza que tu aplicación no comparta estado indebidamente ni abra múltiples conexiones innecesarias.

---

## 3. Adapter de prueba: InMemoryInventoryRepository

Crea el archivo `src/infrastructure/in-memory/InMemoryInventoryRepository.ts` con esta implementación:

```ts
import { InventoryRepositoryPort } from '../../domain/ports/InventoryRepositoryPort'  
import { ProductInventory } from '../../domain/model/ProductInventory'

export class InMemoryInventoryRepository implements InventoryRepositoryPort {  
  private items: Map<string, ProductInventory>

  constructor(initial: Array<{ sku: string; available: number }> = []) {  
    this.items = new Map(initial.map(i => [i.sku, new ProductInventory(i.sku, i.available)]))  
  }

  async findBySku(sku: string): Promise<ProductInventory | null> {  
    const inv = this.items.get(sku)  
    return inv ? new ProductInventory(inv.sku, inv.getAvailable()) : null  
  }

  async save(inventory: ProductInventory): Promise<void> {  
    this.items.set(inventory.sku, new ProductInventory(inventory.sku, inventory.getAvailable()))  
  }  
}
```

Registra este adapter en el container bajo la clave `inMemoryRepo` con `.transient()`.

---

## 4. Tests unitarios de dominio y puerto

Crea `tests/unit/ReserveStockUseCase.spec.ts`:

```ts
import { createContainer } from 'awilix'  
import { InMemoryInventoryRepository } from '../../src/infrastructure/in-memory/InMemoryInventoryRepository'  
import { ReserveStockUseCase } from '../../src/application/use-cases/ReserveStockUseCase'

describe('ReserveStockUseCase - Unit Tests', () => {  
  let container  

  beforeEach(() => {  
    container = createContainer({ injectionMode: 'CLASSIC' })  
    container.register({  
      inMemoryRepo: asClass(InMemoryInventoryRepository).transient(),  
      reserveUseCase: asClass(ReserveStockUseCase).scoped()  
    })  
  })

  it('reduce stock cuando hay suficiente', async () => {  
    const repo = new InMemoryInventoryRepository([{ sku: 'ABC', available: 5 }])  
    container.register({ inventoryRepo: asValue(repo) })  
    const uc = container.resolve<ReserveStockUseCase>('reserveUseCase')  
    await uc.execute('ABC', 3)  
    const inv = await repo.findBySku('ABC')  
    expect(inv!.getAvailable()).toBe(2)  
  })

  it('lanza error si no hay stock', async () => {  
    const repo = new InMemoryInventoryRepository([{ sku: 'XYZ', available: 1 }])  
    container.register({ inventoryRepo: asValue(repo) })  
    const uc = container.resolve<ReserveStockUseCase>('reserveUseCase')  
    await expect(uc.execute('XYZ', 5)).rejects.toThrow('insufficient stock')  
  })  
})
```

Estos tests corren en milisegundos y no necesitan Docker ni base de datos.

---

## 5. Tests de integración con Postgres en memoria

Crea `tests/integration/InventoryRepositoryPostgres.spec.ts`:

```ts
import { PrismaClient } from '@prisma/client'  
import { InventoryRepositoryPostgres } from '../../src/infrastructure/postgres/InventoryRepositoryPostgres'  
import { ProductInventory } from '../../src/domain/model/ProductInventory'

describe('InventoryRepositoryPostgres - Integration', () => {  
  let prisma: PrismaClient  
  let repo: InventoryRepositoryPostgres

  beforeAll(async () => {  
    prisma = new PrismaClient({ datasources: { db: { url: 'file:./test.db?mode=memory&cache=shared' } } })  
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS Inventory (sku TEXT PRIMARY KEY, available INTEGER NOT NULL)`  
    repo = new InventoryRepositoryPostgres(prisma)  
  })

  afterAll(async () => {  
    await prisma.$disconnect()  
  })

  it('almacena y recupera inventario', async () => {  
    const item = new ProductInventory('TEST', 10)  
    await repo.save(item)  
    const fetched = await repo.findBySku('TEST')  
    expect(fetched).not.toBeNull()  
    expect(fetched!.getAvailable()).toBe(10)  
  })  
})
```
