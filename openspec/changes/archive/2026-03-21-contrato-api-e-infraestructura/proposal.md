## Why

Antes de que frontend (Antigravity) y backend (Claude Code) puedan trabajar en paralelo, se necesita una base común: la infraestructura Docker + PostgreSQL, los modelos de datos en SQLModel y un contrato API documentado con endpoints stub en Swagger UI. Esto establece la interfaz entre ambos equipos.

## What Changes

- Crear estructura de directorios del proyecto (backend/app, frontend placeholders)
- Configurar Docker y docker-compose (FastAPI + PostgreSQL)
- Definir modelos SQLModel (Usuario, Ticket, Observacion)
- Inicializar Alembic y generar migración inicial
- Crear esqueleto FastAPI con todos los endpoints como stubs (retornan datos mock)
- Generar contrato API funcional en Swagger UI (/docs)
- Configurar settings con Pydantic (DATABASE_URL, SECRET_KEY)

## Capabilities

### New Capabilities

- `api-contract`: Definición de todos los endpoints REST con sus schemas de request/response, documentados automáticamente en Swagger UI
- `infrastructure`: Docker, docker-compose, PostgreSQL, configuración de entorno

### Modified Capabilities

- `ticket-management`: Se definen los schemas Pydantic/SQLModel que materializan los campos del ticket
- `user-auth`: Se define el schema de Usuario y los endpoints stub de auth
- `code-review`: Se define el schema de observaciones técnicas
- `ticket-tracking`: Se definen los query params de filtrado en el endpoint de listado

## Impact

- **Código nuevo:** backend/app/ completo como esqueleto, Dockerfile, docker-compose.yml
- **Base de datos:** Schema PostgreSQL con tablas usuarios, tickets, observaciones
- **APIs:** Todos los endpoints definidos con tipos pero retornando datos stub
- **Dependencias:** fastapi, uvicorn, sqlmodel, alembic, psycopg2-binary, passlib, itsdangerous
- **Infraestructura:** Docker + docker-compose funcional
