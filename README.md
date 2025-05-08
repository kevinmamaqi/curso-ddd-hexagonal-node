# Curso “DDD, Arquitectura Hexagonal, CQRS & EDA con Node.js”  
**25 h · Mayo 2025 · Medellín (remoto)**

- Curso de [Imagina Formación](https://imaginaformacion.com/).
- Formador: [Kevin Mamaqi Kapllani](https://www.linkedin.com/in/kevinmamaqi/).
- Repo: [https://github.com/kevinmamaqi/curso-ddd-hexagonal-node](https://github.com/kevinmamaqi/curso-ddd-hexagonal-node).

---

### 📄 Licencia

Este contenido está disponible públicamente para su consulta y aprendizaje, pero **no puede ser reutilizado, modificado ni distribuido con fines comerciales** sin autorización expresa del autor.

**Licencia**: [Creative Commons Atribución-NoComercial-SinDerivadas 4.0 Internacional (CC BY-NC-ND 4.0)](https://creativecommons.org/licenses/by-nc-nd/4.0/deed.es)

Esto significa:

- ✅ Puedes ver, descargar y compartir el material con atribución al autor.
- ❌ No puedes modificarlo, adaptarlo ni crear obras derivadas.
- ❌ No puedes utilizarlo con fines comerciales (como cursos, bootcamps, o formación interna).

Para usos distintos a los permitidos por esta licencia, contacta al autor.

---

## 📚 Estructura del repositorio

```
.
├── curso/                    # 12 carpetas, una por día
│   ├── dia-01/               # markdown, ejemplos y quiz
│   ├── dia-02/
│   ├── ...
│   └── dia-12/
├── project/                  # Proyecto evolutivo completo
│   ├── services/             # microservicios Node + TypeScript
│   ├── infrastructure/       # Prisma, docker-compose, etc.
│   └── diagrams/             # C4 exportados con Structurizr
├── .github/                  # CI (lint, test, build, export PNG)
└── README.md                 # (este archivo)
```

| Pilar | Días | Carpeta principal |
|-------|------|-------------------|
| Arquitectura Hexagonal & DDD | 1 – 5 | `curso/dia-02/` … `curso/dia-05/` |
| CQRS & Event Sourcing        | 6 – 7 | `curso/dia-06/`, `curso/dia-07/` |
| Event-Driven Architecture    | 8 – 9 | `curso/dia-08/`, `curso/dia-09/` |
| Observabilidad & Dashboards  | 10    | `curso/dia-10/` |
| Conclusiones & Revisión final| 11-12 | `curso/dia-11/`, `curso/dia-12/` |

---

## 🚀 Requisitos rápidos

| Herramienta | Versión mínima |
|-------------|----------------|
| Node.js     | 20 LTS |
| **npm**     | ≥ 10 |
| Docker & Compose | ≥ 20.10 |
| Git         | ≥ 2.34 |

### Puesta en marcha en 4 pasos

```bash
npm install                # instala dependencias del monorepo
npm run compose:up         # levanta Postgres, RabbitMQ, Prometheus, Grafana
npm run dev:order          # inicia order-service con nodemon + ts-node
npm test                   # ejecuta vitest con cobertura
```

> **Zero-to-demo < 5 min** en un portátil con 16 GB RAM.

---

## 🧩 Proyecto Evolutivo (carpeta `project/`)

| Servicio | Rol | Tech |
|----------|-----|------|
| **order-service** | Hexagonal · DDD · CQRS · ES | Node 20 + TS |
| **inventory-service** | Consumer de eventos, stock | Node |
| **payment-service** | Process Manager / Saga | Node |
| **catalog-service** | Puerto in-memory → Postgres | Node |
| **analytics-service** | Métricas de dominio | Node |

Estructura interna:

```
services/<svc>/
├── src/
│   ├── domain/          # Aggregates, VO, Domain Events
│   ├── application/     # Puertos + UseCases
│   ├── infrastructure/  # Adapters HTTP, DB, MQ
│   └── main.ts          # Bootstrap + DI (awilix)
└── Dockerfile
```

---

## 🛠️ Scripts npm principales

| Comando | Descripción |
|---------|-------------|
| `npm run dev:<svc>` | Arranca servicio con nodemon (`<svc>` = order, inventory…) |
| `npm test` | vitest + cobertura |
| `npm run lint` | eslint + biome |
| `npm run build` | tsc build de todos los servicios |
| `npm run compose:up / compose:down` | docker-compose con o sin volúmenes |

CI (-GitHub Actions):

1. Lint + Unit Tests  
2. Docker build por servicio  
3. Exporta diagramas **C4** PNG como artefactos  
4. Publica cobertura en SonarCloud

---

## 📈 Observabilidad local

| URL | Credenciales |
|-----|--------------|
| `http://localhost:3000` (Grafana) | admin / admin |
| `http://localhost:15672` (RabbitMQ) | guest / guest |
| `http://localhost:9090` (Prometheus) | — |

Dashboard “Business KPIs” ya muestra **GMV** y latencia `order_latency_seconds`.

---

## ✍️ Cómo contribuir

1. **Fork** y clona tu copia  
2. Crea rama `feat/<nombre>` o `fix/<issue>`  
3. Commits con Conventional Commits  
4. Abre **draft PR** — revisión en vivo durante el curso  

---

¡A diseñar software alineado al dominio! 🚀