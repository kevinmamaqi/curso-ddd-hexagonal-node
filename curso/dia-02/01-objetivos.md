# Sesión 2 · 06-may-2025  
## Objetivos del día

| # | Objetivo concreto                                                 | ¿Por qué importa?                                                      |
|---|-------------------------------------------------------------------|------------------------------------------------------------------------|
| 1 | Diferenciar puertos de entrada y salida y sus adaptadores         | Definir contratos precisos evita lógica dispersa y facilita swaps de tecnología. |
| 2 | Modelar el dominio (`ProductInventory`) y crear el puerto de repositorio | Aísla la lógica de negocio de la infraestructura; es la base de un servicio hexagonal. |
| 3 | Configurar Dependency Injection (DI) con Awilix e inyectar el repositorio Postgres       | Cumplir DI y permitir tests de dominio sin arranque de bases de datos reales. |
| 4 | Desarrollar rutas HTTP “finas” que deleguen en el Use Case        | Mantener el core limpio, maximizar testabilidad y simplificar el código de infraestructura. |
| 5 | Escribir y ejecutar tests unitarios del adapter Postgres          | Verificar el correctísimo funcionamiento antes de integrar el servicio completo. |

---

## Relación con el Proyecto Final

Hoy avanzamos el **inventory-service**: implementamos el dominio, puerto, adapter Postgres, Use Case y la primera ruta HTTP.

---

## Requisitos antes de empezar

- Contenedores up (`docker compose up -d`)  
- Código de sesión 1 en `services/inventory-service` funcionando  
- VS Code abierto en la carpeta del servicio con ESLint activo  

Con estos objetivos claros, arrancamos sesión 2 enfocándonos en puertos, adapters y DI. ¡Vamos allá!