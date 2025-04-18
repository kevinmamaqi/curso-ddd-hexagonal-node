# Concept Quiz 02 – Sesión 2  
*(Tiempo recomendado: 10 min.)*

### Preguntas

1. (Selección múltiple)  
   ¿Qué responsabilidad **NO** pertenece a un *Port*?  
   A) Definir contratos internos  
   B) Traducir protocolos HTTP ↔ dominio  
   C) Aislar la lógica de negocio  
   D) Permitir pruebas sin infraestructura real  

2. (Verdadero / Falso)  
   Un *Adapter* de salida puede importar código del dominio pero el dominio nunca debe importar del adapter.

3. (Respuesta corta, ≤ 25 palabras)  
   Explica por qué un Puerto de Entrada no debería lanzar excepciones HTTP‑specific (`FastifyError`).

4. (Selección múltiple)  
   ¿Cuál es la principal ventaja de usar un adapter *in‑memory* en tests?  
   A) Mayor throughput en producción  
   B) Simular fallas de red controladas  
   C) Ejecutar pruebas sin I/O externo  
   D) Reducir el tamaño del contenedor Docker

5. (Respuesta corta)  
   Menciona dos riesgos de tener lógica de mapeo (DTO ↔ Entidad) dispersa por toda la base de código.

### Fin