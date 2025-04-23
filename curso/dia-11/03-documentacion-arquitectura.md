# Tema VIII (parte 2) — Documentación viva con C4 Model & Structurizr DSL

## 1. Niveles C4 del sistema

1. **Context** – Relación del sistema con usuarios y sistemas externos.  
2. **Container** – Microservicios (`order`, `inventory`, …) y brokers.  
3. **Component** – Adaptadores, UseCases, Aggregates.  
4. **Code** – Clases/archivos clave (opcional).

## 2. DSL minimal (Structurizr)

```dsl
workspace "DDD-CQRS-EDA Demo" {
  model {
    user = person "Cliente"
    order = container "order-service" "Node + Hexagonal"
    inventory = container "inventory-service"
    rabbit = container "RabbitMQ" "Broker"

    user -> order "POST /orders"
    order -> rabbit "OrderCompleted"
    rabbit -> inventory "OrderCompleted"
  }
  views {
    container deployment "Overview" {
      include *
    }
    theme "https://static.structurizr.com/themes/clear-theme.json"
  }
}
```

Exporta con:

```bash
structurizr-cli export -workspace workspace.dsl -format png -output diagrams/
```

Coloca `diagrams/overview.png` en el README.

## 3. Buenas prácticas de documentación

| Regla | Check |
|-------|-------|
| Diagramas generados desde código (DSL) | ✅ |
| Actualizados en CI (artefacto) | ✅ |
| Ref. explícita de eventos clave en descripción | ✅ |
| Link a métricas/dashboards dentro del diagrama | ✅ |