## Why

Las solicitudes de soporte técnico en entornos académicos y de desarrollo se gestionan informalmente (mensajes, correos, conversaciones), generando desorganización, falta de trazabilidad y dificultad para dar seguimiento a incidencias. Se necesita una plataforma centralizada que registre, clasifique y controle cada solicitud hasta su resolución, incluyendo la capacidad de revisar fragmentos de código como parte del soporte.

## What Changes

- Crear una aplicación web completa desde cero (no existe código previo)
- Backend API REST con Python + FastAPI + SQLModel + PostgreSQL
- Frontend multi-page con HTML5, Vanilla JS y SCSS
- Sistema de tickets con flujo de estados: Abierto → En revisión → En proceso → Resuelto → Cerrado
- Módulo de revisión de fragmentos de código con syntax highlighting (highlight.js)
- Autenticación básica con sesiones y cookies
- Dockerización completa con docker-compose para deploy en Railway
- Documentación API auto-generada vía Swagger UI (/docs)

## Capabilities

### New Capabilities

- `ticket-management`: CRUD de tickets con campos (título, descripción, categoría, prioridad, estado, fecha, observaciones, resolución, fragmento de código opcional) y sistema de estados
- `code-review`: Módulo para tickets que incluyen fragmentos de código, con syntax highlighting y observaciones técnicas
- `user-auth`: Login básico con sesiones, protección de rutas de API
- `ticket-tracking`: Listado, filtrado y seguimiento visual de tickets por estado, prioridad y categoría

### Modified Capabilities

(ninguna — proyecto nuevo)

## Impact

- **Código nuevo:** Backend completo (FastAPI app, modelos, routers, migraciones), frontend completo (6 páginas HTML, JS por módulo, SCSS)
- **Base de datos:** Schema PostgreSQL con tablas para usuarios, tickets y observaciones
- **APIs:** Endpoints REST bajo /api/ para tickets, autenticación y revisión de código
- **Dependencias:** Python (fastapi, sqlmodel, alembic, uvicorn), Node (dart-sass para compilar SCSS), highlight.js
- **Infraestructura:** Dockerfile, docker-compose.yml, configuración Railway
