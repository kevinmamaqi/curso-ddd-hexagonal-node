# Revisión final del proyecto

## Checklist de entrega

| Ítem | Criterio | OK |
|------|----------|----|
| Pipelines CI/CD | Lint + test + build contenedores |  |
| Cobertura tests | ≥ 80 % |  |
| Observabilidad | Dashboard “Business KPIs” + alertas |  |
| Documentación | README + diagramas C4 + guides |  |
| Docker Compose | `up` en < 60 s, health-checks OK |  |
| Issues Phase II | Backlog priorizado |  |

## Plan “Next 90 Days”

1. Migrar Event Store a PostgreSQL logical replication.  
2. Introducir *Canary releases* con Flagger.  
3. Automatizar contratos PACT en pipeline nightly.  
4. Agregar *chaos testing* con Toxiproxy.  
5. Benchmark escalabilidad con k6.

*El equipo se divide en squads; cada mejora se asigna como épica.*