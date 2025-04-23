# Sesión 3 · 07-may-2025  
## Objetivos del día

| # | Objetivo concreto                                             | ¿Por qué importa?                                                        |
|---|---------------------------------------------------------------|---------------------------------------------------------------------------|
| 1 | Identificar y delimitar Bounded Contexts en un dominio        | Evita ambigüedades semánticas y reduce el riesgo de deuda técnica futura. |
| 2 | Mapear relaciones entre contextos (Partnership, Customer/Supplier, ACL) | Garantiza acuerdos claros entre equipos y define contratos de integración. |
| 3 | Implementar un ejemplo de Anticorruption Layer (ACL) entre dominios | Aísla tu modelo de negocio de cambios en sistemas externos.               |
| 4 | Revisar y reforzar separación de responsabilidades (Dominio, Aplicación, Infra) | Mantiene cada capa enfocada en su propósito y facilita la mantenibilidad. |
| 5 | Aplicar las buenas prácticas de DIP vistas (Constructor injection, Null Object) | Refuerza inmutabilidad y testabilidad en los Use Cases y adapters.        |

---

## Relación con el Proyecto Final

Hoy avanzamos el **inventory-service** definiendo límites del dominio y configurando la infraestructura para futuros intercambios de eventos y servicios externos.

---

## Requisitos antes de empezar

- Código de Sesión 2 completamente funcional  
- Contenedores up (`docker compose up -d`)  
- Entender los conceptos de Ports & Adapters y DI con Awilix  
- VS Code con ESLint y TypeScript sin errores  

Con estos objetivos claros, comenzamos la Sesión 3 centrados en los límites del dominio y la integración segura entre contextos. ¡Vamos allá!