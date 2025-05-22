
## Repaso Rápido: Aprendizajes Clave

En las sesiones anteriores, hemos sentado una base sólida para la arquitectura de software moderna, especialmente en entornos de microservicios con Node.js.

**Temas Centrales y Progresión:**

1. **Abordar la Complejidad:**
   - Comenzamos identificando el **"Big Ball of Mud"** y cómo la complejidad creciente degrada la productividad.
   - La idea central es **separar responsabilidades**, diferenciando claramente el **Dominio** (lógica de negocio) de la **Infraestructura** (detalles técnicos como bases de datos y frameworks).

2. **Patrones Arquitectónicos como Soluciones (Sesiones 1-8):**
   - **Domain-Driven Design (DDD):**
     - **DDD Estratégico:** Enfatiza el lenguaje ubicuo, identificación de subdominios (Core, Soporte, Genérico) y definición de **Límites de Contexto**.
     - **DDD Táctico:** Modelos de dominio ricos con **Entidades**, **Value Objects**, **Aggregates**, **Eventos de Dominio**, **Repositorios**, **Servicios de Dominio** y **Factories**.
   - **Arquitectura Hexagonal (Ports and Adapters):**
     - Protege la lógica de negocio de cambios tecnológicos mediante **puertos** (interfaces) y **adaptadores** (implementaciones).
     - Uso de **Inyección de Dependencias** para acoplamiento flexible.
   - **CQRS (Segregación de Responsabilidad de Comandos y Consultas):**
     - Separa operaciones de escritura (**Comandos**) y lectura (**Consultas**).
     - Consideraciones sobre **consistencia eventual**.
   - **Arquitectura Orientada a Eventos (EDA):**
     - Comunicación asincrónica mediante **brokers de eventos** (RabbitMQ/Kafka).
     - Patrones como **Event Sourcing**, **Outbox Pattern** y **Sagas**.
     - Estrategias de **versionado de eventos** y **recuperación de errores**.

3. **Node.js y Microservicios:**
   - Ventajas del modelo **asincrónico/no bloqueante** de Node.js.
   - Herramientas recomendadas: Fastify, Prisma, OpenTelemetry, Awilix, etc.

4. **Pruebas:**
   - **Pruebas unitarias** para lógica de dominio.
   - **Pruebas de integración** para adaptadores.
   - Énfasis en velocidad y confiabilidad.

5. **Observabilidad:**
   - Tres pilares: **Logs**, **Métricas** y **Trazas**.
   - Implementación con **OpenTelemetry** y visualización en Grafana.

**Conclusión Clave:** Has aprendido a diseñar sistemas mantenibles, escalables y resilientes mediante separación de responsabilidades y comunicación orientada a eventos.


## Buenas Prácticas para Documentación de Arquitectura (Ampliado)

El Modelo C4 es un marco de trabajo para visualizar y documentar arquitecturas de software mediante cuatro niveles de abstracción progresiva: Contexto (sistema en su entorno global), Contenedores (servicios/aplicaciones principales), Componentes (módulos internos) y Código (detalles de implementación). Diseñado por Simon Brown, este enfoque permite comunicar la arquitectura a diferentes audiencias (desarrolladores, ejecutivos, operaciones) con el nivel de detalle apropiado. Por ejemplo, un diagrama de contexto muestra cómo un sistema de e-commerce interactúa con usuarios y servicios externos, mientras que un diagrama de componentes detalla cómo el módulo de pagos se integra con la pasarela externa. Su fuerza radica en la simplicidad visual y en evitar la sobrecarga de información, facilitando la alineación técnica y la toma de decisiones.

Structurizr DSL es un lenguaje específico de dominio (DSL) que permite definir modelos arquitectónicos alineados al C4 usando texto plano, compatible con herramientas como GitHub. En lugar de dibujar diagramas manualmente, describes elementos (personas, sistemas, contenedores) y sus relaciones en código, que luego se renderiza automáticamente en diagramas coherentes. Por ejemplo, puedes declarar container "OrderService" "Node.js" y sus conexiones con otros servicios, generando vistas actualizadas al modificar el código. Esta integración con flujos docs-as-code permite versionar la documentación, generar diagramas en pipelines CI/CD, y mantener una única fuente de verdad entre el código y la arquitectura, eliminando discrepancias comunes en documentación estática.

### Componentes principales

1. **Jerarquía Completa:**
   - **Personas y Sistemas Externos:** Clientes, administradores, y dependencias externas.
   - **Contenedores:** 3 microservicios + API Gateway + WebApp.
   - **Componentes Internos:** Lógica específica de cada servicio (controladores, adaptadores, repositorios).
   - **Despliegue:** Detalle de infraestructura en AWS (EC2, RDS, Redis).

2. **Vistas Múltiples:**
   - **Contexto:** Visión general del sistema y su entorno.
   - **Contenedores:** Cómo interactúan los servicios entre sí.
   - **Dinámica:** Flujo específico de procesamiento de pedidos.
   - **Despliegue:** Dónde se aloja cada componente físicamente.

3. **Estilos Visuales:**
   - Colores y formas para diferenciar tipos de elementos (externos vs internos).
   - Líneas punteadas para conexiones a sistemas externos.

4. **Integración con ADRs:**
   - Referencia explícita a decisiones arquitectónicas (Ej: uso de RabbitMQ).


### Ejemplos:
- [Ejemplo 1](https://structurizr.com/share/36141/diagrams#SystemContext)
- [Ejemplo 2](https://docs.structurizr.com/dsl/adrs)

---

## Buenas Prácticas

### **1. Documentación Viva con Automatización**
- **Pipeline CI/CD Ejemplo:**
  ```yaml
  # .github/workflows/docs.yml
  name: Generate Architecture Docs
  on: [push]
  jobs:
    generate-diagrams:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - name: Setup Structurizr CLI
          run: npm install -g @structurizr/cli
        - name: Generate Diagrams
          run: structurizr-cli export -w workspace.dsl -f plantuml
        - name: Upload Artifacts
          uses: actions/upload-artifact@v3
          with:
            name: architecture-diagrams
            path: ./out
  ```

### **2. ADR (Architecture Decision Record) Ejemplar**
```markdown
# ADR-003: Uso de RabbitMQ para Eventos

## Contexto
Necesitamos un broker de eventos para comunicación asíncrona entre servicios.

## Opciones Evaluadas
1. **Apache Kafka:** Alto rendimiento, persistencia, pero complejidad operativa.
2. **RabbitMQ:** Protocolo AMQP, colas tradicionales, más sencillo para nuestro equipo.

## Decisión
**RabbitMQ** por:
- Madurez y amplia documentación.
- Soporte nativo para patrones como DLQ/Exchanges.
- Equipo ya tiene experiencia operativa con él.

## Consecuencias
- Deberemos implementar el *Outbox Pattern* para garantizar entrega.
- Planificar escalado horizontal con clusters si el volumen crece.
```

---

## Próximos Pasos

### **1. Madurez en Event-Driven Architecture**
- **Implementar Schema Registry:** Para gestión centralizada de esquemas de eventos (Ej: Apache Avro).
- **Ejemplo de Evento:**
  ```json
  {
    "eventType": "OrderCreated/v1",
    "data": {
      "orderId": "ABC-123",
      "items": [{"productId": "X1", "quantity": 2}],
      "correlationId": "CID-789"
    },
    "metadata": {
      "source": "OrderService",
      "timestamp": "2024-02-15T10:00:00Z"
    }
  }
  ```

### 2. Observabilidad Profunda
- **Métricas Clave por Servicio:**
  | Servicio          | Métricas                                                      |
  |-------------------|---------------------------------------------------------------|
  | OrderService      | Tiempo medio de procesamiento, errores de pago, órdenes fallidas |
  | InventoryService  | Stock bajo, tiempos de reserva, eventos de desabastecimiento    |
  | NotificationService | Latencia de notificaciones, tasa de fallos SMS/Email          |

### 3. Evolución de Bounded Contexts
- **Mapa de Contextos:**
```mermaid
graph LR
  A[Pedidos] -->|Publica OrderCreated| B[Inventario]
  A -->|Usa| C[Pagos]
  B -->|Publica StockUpdated| D[Analíticas]
  D -->|Consume| E[Almacenamiento en BigQuery]
```

### Canary Release
Un canary release es una estrategia de despliegue progresivo que consiste en liberar una nueva versión del software a un subconjunto reducido de usuarios o infraestructura antes de desplegarla al 100%. Esto permite detectar errores, degradaciones de rendimiento o efectos no deseados en producción con un impacto limitado. La clave está en monitorear activamente métricas y logs durante esta fase y comparar el comportamiento entre versiones. Si todo funciona como se espera, el despliegue continúa de forma escalonada; si se detectan fallos, se revierte rápidamente. Es una técnica crítica en entornos con alta disponibilidad o grandes volúmenes de tráfico, donde un fallo global sería costoso.

### Chaos Testing
El chaos testing o chaos engineering es una práctica deliberada que busca introducir fallos en un sistema en producción (o entornos muy similares) con el objetivo de validar su resiliencia. En lugar de asumir que todo funcionará bien, se parte de la premisa contraria: los sistemas distribuidos fallan, y es necesario anticipar cómo se comportan bajo presión. Se simulan cortes de red, caídas de servicios, sobrecargas o errores aleatorios, y se mide si el sistema logra recuperarse sin afectar la experiencia del usuario. Esta disciplina, popularizada por Netflix con su Chaos Monkey, es esencial para construir software robusto y tolerante a fallos reales.