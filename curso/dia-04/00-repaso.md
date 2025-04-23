# Sesión 4 · 08-may-2025  
## Repaso exprés de la Sesión 3

| Tema                    | Insight clave                                                                            | Acción inmediata                                                       |
|-------------------------|------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| **Scopes DI (Awilix)**  | `singleton()`, `scoped()`, `transient()` definen el ciclo de vida de las instancias: evita fugas de estado. | Revisa `container.ts` y confirma que Prisma esté registrado como singleton y los repositorios como scoped. |
| **Adapter In-Memory**   | Un repositorio en memoria permite tests ultrarrápidos sin dependencia de infraestructura. | Implementa y registra `InMemoryInventoryRepository` como `.transient()`. |
| **Unit Tests de UseCase** | Validan la lógica de dominio y puertos sin tocar la infraestructura.                  | Ejecuta los tests de UseCase y corrige cualquier dependencia directa a la capa de infraestructura. |
| **Integration Tests**   | Verifican los adapters (Postgres) usando la base de datos en memoria.                    | Asegúrate de que los tests creen y eliminen la tabla `Inventory` dinámicamente. |

