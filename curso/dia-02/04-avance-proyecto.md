# 04-avance-proyecto · Inventory Service – Sesión 2

Objetivo de la práctica (1 hora):
Poner en marcha el esqueleto hexagonal de inventory-service, trabajar puertos, adaptadores y DI, y arrancar con Prisma.

Descripción del servicio:
El Inventory Service gestiona el stock de productos identificados por SKU. Permite:

- Consultar existencias disponibles
- Reservar unidades cuando se crea un pedido
- Actualizar o crear registros en la base de datos

Esquema Prisma mínimo:
Modelo Inventory con campos:

- sku String como clave primaria
- available Int para unidades disponibles

1. Prepara tu entorno (15 min)
   Verifica en project/services/inventory-service:

- package.json, tsconfig.json, .eslintrc.json, Dockerfile, .env con variables PORT y DATABASE_URL
- Carpetas vacías: src/domain/model, src/domain/ports, src/application/use-cases, src/application, src/infrastructure/postgres, src/infrastructure/http, y main.ts  
  Ejecuta npm install y npm run build para confirmar que compila.

2. Descripción del reto (40 min)
   Bosqueja la estructura hexagonal sin escribir todo el código, sólo define y piensa en:

a) Puerto de salida

- Interfaz con método findBySku(sku) que devuelve el objeto de dominio o null
- Método save(inventory) que persiste cambios
- Reflexiona: ¿qué parámetros reciben? ¿qué devuelven? ¿qué validaciones internas?

b) Adaptador Postgres

- Clase que implementa el puerto, recibe PrismaClient por constructor
- En findBySku consulta la tabla Inventory y construye la entidad de dominio
- En save utiliza upsert para crear o actualizar el registro
- Piensa: ¿cómo mapear la fila a la entidad? ¿qué errores hay que capturar?

c) Contenedor de dependencias

- Registrar PrismaClient como singleton
- Registrar repositorio como scoped
- Debe quedar listo para futuros use-cases
- Discute: ¿por qué usar singleton vs scoped? ¿qué ocurre si cambias el scope?

d) Arranque y DI

- buildServer crea el contenedor, configura Fastify/Express con logger y pasa el container al módulo de rutas
- Módulo de rutas define una ruta de health que devuelve estado ok
- Define ruta de reserva que extrae SKU y cantidad del request, invoca use case y responde 204 o error
- Reflexiona: ¿cómo gestionas errores y respuestas HTTP?

3. Pasos de arranque y comprobación (5 min)

- Genera Prisma Client con npx prisma generate
- Ejecuta npm run dev y observa logs de conexión
- Comprueba curl http://localhost:3000/health responde correctamente

4. Reflexión y debate (15 min)

- Separación de responsabilidades: puerto vs adaptador vs use-case vs servidor HTTP
- Inyección de PrismaClient: ¿cómo evitar fugas al dominio?
- Escalabilidad: si añades más servicios, ¿cómo organizas el container y los módulos?

Nota: en la próxima sesión implementaremos un caso de uso concreto y añadiremos tests unitarios e integración siguiendo este patrón.
