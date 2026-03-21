# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Proyecto académico para **Programación Web II** (Docente: Javier Ochoa). Sistema de Tickets para Soporte Técnico y Revisión de Fragmentos de Código.

## Comandos de desarrollo

```bash
# Levantar todo (app + PostgreSQL)
docker-compose up --build

# Detener
docker-compose down

# Detener y borrar datos de BD
docker-compose down -v

# Crear migración de Alembic (desde raíz del proyecto)
cd backend && alembic revision --autogenerate -m "descripción"

# Aplicar migraciones (se ejecutan automáticamente al iniciar la app vía lifespan)
cd backend && alembic upgrade head
```

- App: http://localhost:8000
- Swagger: http://localhost:8000/docs
- PostgreSQL expuesto en puerto 5432 (`tickets_user`/`tickets_pass`/`tickets_db`)

## Stack

- **Backend:** Python 3.12 + FastAPI + SQLModel + Alembic
- **Frontend:** HTML5 + Vanilla JS (ES modules) + SCSS
- **BD:** PostgreSQL 16
- **Infra:** Docker multi-stage (Node para compilar SCSS → Python para la app)

## Arquitectura

### Monolito con FastAPI sirviendo todo

FastAPI sirve tanto la API REST (`/api/*`) como las páginas HTML como archivos estáticos. No hay framework frontend — son archivos `.html` que cargan JS con ES modules. Los archivos estáticos se montan en `/static` apuntando a `frontend/`.

### Patrón de imports

Todos los imports del backend usan rutas absolutas desde la raíz: `from backend.app.models import ...`, `from backend.app.database import ...`. Esto es porque el `WORKDIR` de Docker es `/app` y los módulos se resuelven desde ahí.

### Autenticación

Basada en cookies con `itsdangerous.URLSafeTimedSerializer`. No hay JWT. La cookie `session` contiene el user ID firmado con `SECRET_KEY`. Todas las rutas de tickets requieren `get_current_user` como dependencia.

### Modelos (SQLModel)

Tres tablas: `usuarios`, `tickets`, `observaciones`. Cada modelo tiene variantes `Base`, `Create`, `Read` y opcionalmente `Update`. Los modelos de tabla heredan de `Base` con `table=True`.

### Estado de tickets (máquina de estados)

`Abierto` → `En revisión` → `En proceso` → `Resuelto` → `Cerrado`. Las transiciones válidas están definidas en `TRANSICIONES_VALIDAS` en `backend/app/routers/tickets.py`. Resolver un ticket requiere texto de resolución obligatorio y que el ticket esté `En proceso`.

### Frontend JS

Cada página tiene su propio archivo JS. `api.js` es el wrapper central (exporta `apiGet`, `apiPost`, `apiPatch`, `apiDelete`). Redirige automáticamente a `/login` si recibe un 401.

### SCSS

Compilado en el Docker build (stage 1 con Node). Los parciales (`_variables.scss`, `_layout.scss`, etc.) se importan desde `main.scss` y se compilan a `frontend/css/main.css`.

## Deploy

Railway con detección automática del Dockerfile. Requiere servicio PostgreSQL y variables `DATABASE_URL` + `SECRET_KEY`.

## OpenSpec Workflows

Usar `/opsx:*` o `/openspec-*` para gestionar cambios: explore → new → continue → apply → verify → archive.
