# Tema 5 — CQRS: Fundamentos

En este primer bloque de **CQRS** nos centraremos en los fundamentos esenciales que toda arquitectura debe contemplar antes de incorporar patrones más avanzados. Sin rodeos, analizaremos por qué dividir lecturas y escrituras, cómo se relacionan sus componentes clave y cómo se materializa este enfoque en un ejemplo real de dominio.
 
## 0. Dinámica Inicial: "El Dilema del Modelo Único"
**Actividad Grupal**:  

**Escenario de partida:**
Imaginemos que estamos diseñando la arquitectura backend para una plataforma de reservas de hoteles con 500.000 usuarios activos al día.

**Actualmente, manejamos:**
- 10.000 búsquedas por minuto (filtros complejos: ciudad, fecha, disponibilidad, precio, promociones, etc.)
- 200 reservas por minuto (creación de registros, bloqueo de habitación, transacciones, notificaciones)

**Problemas a resolver:**
- Todo está bajo un modelo de datos único.
- Usamos un enfoque clásico de repositorios CRUD sobre una única base de datos relacional.
- La empresa quiere añadir un nuevo tipo de habitación: “habitaciones premium”, con políticas de disponibilidad distintas y reglas específicas de validación.

**Preguntas a responder:**
1. ¿Qué problemas anticipan en términos de rendimiento, escalabilidad o mantenimiento?
2. ¿Qué riesgos existen si queremos escalar solo el sistema de consultas?
3. ¿Cómo afectaría una migración de esquema para añadir "habitaciones premium"?

---

## 1. Fundamentos Conceptuales

### 1.1 Anatomía de un Cuello de Botella
**Demostración Visual**:  
```mermaid
flowchart TB
    CRUD[CRUD API] -->|SELECT JOINs| DB[(SQL Único)]
    CRUD -->|UPDATE locks| DB
    User[UI/BFF] --> CRUD
```
- **Problema 1**: Bloqueos por escrituras largas (ej: validación de stock) retrasan lecturas críticas.  
- **Problema 2**: Índices optimizados para reportes ralentizan transacciones (trade-off físico).  

**Caso Real**:  
- *Ejemplo Twitter*: En 2012, su API de escritura (tweets) y lectura (timelines) colisionaban, requiriendo partición gradual.

### 1.2 CQRS como Separación de Intereses  
**Metáfora**:  
- *Cocina de restaurante*:  
  - **Command Side**: Chef (escribe) organiza estaciones para eficiencia en preparación.  
  - **Query Side**: Mesero (lee) tiene menú desnormalizado para respuestas rápidas.  

**Principios Técnicos**:  
- **Segregación por Modelo**:  
  - **Write Model**: Agregados DDD + invariantes (ej: `InventoryAggregate.reserve()`).  
  - **Read Model**: Vistas específicas por caso de uso (ej: `StockDashboardView`).  

**Diagrama Comparativo**:  
```mermaid
flowchart LR
    A[CRUD] --> B[Mismo Modelo]
    C[CQRS] --> D[Write Model + Read Models]
```

### 1.3 No Todo es Oro: Trade-offs 
**Discusión Guiada**:  
- ✅ Ventajas:  
  - Escalabilidad independiente (ej: Redis Cache para queries, Kafka para eventos).  
  - Modelos especializados (ej: GraphQL para móvil, SQL para backoffice).  
- ❌ Desventajas:  
  - Complejidad eventual: Consistencia, sincronización de modelos.  
  - Sobrecarga en despliegues (ej: Mantener 3 read models en MongoDB, ES, etc).  

---

## 2. Arquitectura de Referencia

### 2.1 Componentes Clave con Responsabilidades 
**Deep Dive**:  
- **Command Handler**:  
  - Valida permisos, carga agregados, ejecuta lógica.  
  - **Código Ejemplo**:  
    ```typescript
    class ReserveStockHandler {
      async execute(command) {
        // 1. Validación de formato
        if (!command.payload.items) throw new InvalidCommandError();
        
        // 2. Carga estado actual
        const order = await repo.load(command.orderId);
        
        // 3. Invoca dominio
        order.reserve(items);
        
        // 4. Persiste y publica
        await repo.save(order);
        await eventBus.publish(order.events);
      }
    }
    ```
- **Event Store**:  
  - Base de eventos inmutables (ej: EventStoreDB, DynamoDB Streams).  
  - Patrón "Append-Only": Los eventos son fuentes de verdad.  

### 2.2 Flujo End-to-End con Casos de Error 
**Secuencia con Fallos**:  
```mermaid
sequenceDiagram
    participant UI as Frontend
    participant CH as Command Handler
    participant ES as Event Store
    participant P as Projector
    participant RM as Read Model
    
    UI->>CH: ReserveStock
    CH->>ES: Append StockReserved
    ES-->>CH: OK
    CH-->>UI: 200 OK
    
    Note over ES,P: ¡Proyector falla!
    ES->>P: StockReserved (reintentar x3)
    P->>RM: Update
    RM-->>P: Error de conexión
    P-->>ES: NACK
    
    Note over ES: Dead Letter Queue
    ES->>Monitor: Alerta
```
- **Mecanismos de Resiliencia**:  
  - Reintentos exponenciales en proyectores.  
  - Dead Letter Queues + Monitorización.  
  - Reconstrucción de Read Models desde Event Store.

---

## 3. Ejemplo Práctico: Dominio *InventoryOrder*

### 3.1 Live Coding: De CRUD a CQRS (10 min)  
**Antes (CRUD)**:  
```typescript
// Servicio monolítico
class InventoryService {
  async reserveStock(orderId, items) {
    const tx = await db.startTransaction();
    
    try {
      // 1. Bloquea filas
      const stock = await tx.query('SELECT * FROM stock WHERE sku IN (...) FOR UPDATE');
      
      // 2. Valida y actualiza
      items.forEach(item => {
        if (stock.find(s => s.sku === item.sku).available < item.qty) 
          throw new Error('Stock insuficiente');
        stock.reserved += item.qty;
      });
      
      // 3. Actualiza múltiples tablas
      await tx.update('stock', stock);
      await tx.insert('reservations', { orderId, items });
      
      await tx.commit();
    } catch (err) {
      await tx.rollback();
    }
  }
}
```
**Problemas Identificados**:  
- Bloqueos de largo alcance (FOR UPDATE).  
- Acoplamiento entre reservas y consultas.  

**Después (CQRS)**:  
```typescript
// Command Side
class ReserveStockCommandHandler {
  constructor(private repo, private eventBus) {}
  
  async execute(command) {
    const order = await this.repo.load(command.orderId);
    order.reserve(command.items);
    await this.repo.save(order);
    await this.eventBus.publish(order.events);
  }
}

// Read Side (Proyección)
class StockProjector {
  constructor(private readDb) {}
  
  async onStockReserved(event) {
    // Actualización eventualmente consistente
    await this.readDb.collection('stock').updateMany(
      { sku: { $in: event.items.map(i => i.sku) } },
      { $inc: { reserved: item.qty } }
    );
  }
}
```

### 3.2 Simulación de Escalabilidad  
**Escenario**:  
- 100k reservas/hora vs 5M consultas de stock/día.  

**Configuración en AWS**:  
- **Command Side**:  
  - Lambda + DynamoDB (Event Store) + Reserved Concurrency.  
- **Query Side**:  
  - API Gateway + ElasticCache (Redis) con TTL de 10 segundos.  
  - ElasticSearch para búsquedas complejas.  

**Métrica Clave**:  
- Escrituras: 500 ms/op (consistencia fuerte).  
- Lecturas: 5 ms/op (consistencia eventual).  

### 3.3 Discusión de Patrones Relacionados  
- **Event Sourcing**: No es obligatorio, pero común en CQRS.  
- **Sagas**: Coordinación entre agregados vía eventos.  
- **Caching Strategies**:  
  - **Write-Through**: Actualiza cache en comandos.  
  - **Refresh-Ahead**: Pre-calcula consultas frecuentes.  

---

## 4. Cierre y Preparación para la Próxima Sesión (5 min)  

- **Resumen Visual**:  
  ```mermaid
  journey
    title Ciclo de Vida CQRS
    section Comando
      Command Handler: 5: Ejecuta
      Event Store: 3: Persiste
    section Consulta
      Read Model: 5: Responde
      Projector: 3: Actualiza
  ```

- **Diagrama de CQRS**:
```mermaid
graph TD
    CQRS[CQRS] -->|Separa| C[Comandos]
    CQRS -->|De| Q[Queries]
    C -->|Mutan| D[Modelo de Dominio]
    Q -->|Leen| RM[Read Model]
    D -->|Emite| E[Eventos]
    E -->|Actualizan| RM
```

**Evaluación Rápida y ejercicios**:  
- 3 Preguntas Rápidas (Kahoot!):  
  1. ¿Qué componente maneja la lógica de negocio en CQRS?  
  2. ¿True or False?: CQRS requiere siempre Event Sourcing.  
  3. Nombra tres ventajas de separar modelos de lectura/escritura.  

