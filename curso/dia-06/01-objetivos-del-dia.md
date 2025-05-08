# Sesión 6 · 13-may-2025

## Objetivos del día

Durante esta sesión profundizaremos en los fundamentos y en la implementación práctica del patrón CQRS (Command Query Responsibility Segregation) dentro de un entorno Node.js. Se pretende que los participantes no solo comprendan el modelo conceptual detrás de la separación entre comandos y consultas, sino que además sean capaces de aplicarlo de forma estructurada en un contexto realista.

### Objetivos de aprendizaje

* Comprender la motivación detrás del uso de CQRS, reconociendo los límites de los modelos CRUD tradicionales.
* Identificar claramente las diferencias semánticas y técnicas entre comandos (acciones que cambian el estado) y queries (acciones que lo consultan).
* Entender cómo estructurar un proyecto que aplica CQRS en Node.js utilizando handlers, buses y validaciones.
* Construir un flujo completo de comando con validación, persistencia de evento y proyección asociada.
* Introducir el concepto de Event Store y su rol en un sistema orientado a eventos.
* Revisar y solidificar conceptos mediante un quiz técnico al final de la sesión.

Al finalizar la clase, los participantes deberán sentirse cómodos creando comandos, handlers y proyecciones simples, además de poder evaluar cuándo tiene sentido aplicar CQRS en un sistema determinado.

> “No es solo separar lectura y escritura: es entender cuándo, cómo y por qué hacerlo.”
