## 1. Repaso de la Sesión 1

Antes de adentrarnos en Arquitectura Hexagonal, repasemos los conceptos clave que cubrimos ayer, su importancia y un pequeño reto práctico para afianzar cada uno.

| Concepto               | Descripción resumida                                                                     | Micro-challenge                                                         |
|------------------------|------------------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| **Big Ball of Mud**    | Un sistema monolítico mal estructurado en el que la lógica de negocio y la técnica se enredan, provocando un mantenimiento muy costoso. | Localiza en tu código un área con alta densidad de dependencias cruzadas (por ejemplo, un archivo o módulo con lógica mezclada). |
| **Arquitectura Hexagonal** | Separación clara entre el **dominio** (reglas de negocio) y la **infraestructura** (bases de datos, frameworks, APIs).             | Dibuja un diagrama simple de puertos y adaptadores para uno de tus servicios actuales.       |
| **Domain-Driven Design**   | Utilizar un **Lenguaje Ubicuo** y modelos ricos (Entities, Value Objects, Aggregates) para reflejar con precisión las reglas del negocio. | Anota tres términos que tu Product Owner usa con frecuencia y piensa cómo los representarías en tu modelo de dominio. |
| **CQRS**               | Separar las operaciones de **escritura** (Commands) de las de **lectura** (Queries) para optimizar y escalar cada flujo por separado. | Identifica un endpoint de tu API actual que mezcle lectura y escritura, y reflexiona cómo lo dividirías en Command y Query.  |
| **Event-Driven Architecture** | Comunicación entre servicios mediante **eventos asíncronos**, favoreciendo el desacoplamiento y la resiliencia.               | Describe un caso real en tu proyecto donde podrías publicar un evento de dominio en lugar de invocar un servicio de forma síncrona. |

