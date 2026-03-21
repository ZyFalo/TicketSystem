# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Proyecto académico para **Programación Web II** (Docente: Javier Ochoa). Sistema de Tickets para Soporte Técnico y Revisión de Fragmentos de Código con tres roles (cliente, developer, senior).

## Comandos de desarrollo

```bash
# Levantar todo (app + PostgreSQL)
docker-compose up --build

# Detener
docker-compose down

# Detener y borrar datos de BD
docker-compose down -v

# Reiniciar app sin rebuild (cambios de backend)
docker compose restart app

# Compilar SCSS localmente (cambios de frontend en dev con volúmenes montados)
sass frontend/scss/main.scss frontend/css/main.css --style=compressed --no-source-map

# Migraciones con Alembic (ejecutar dentro del contenedor o con PYTHONPATH=.)
cd backend && alembic revision --autogenerate -m "descripcion"
cd backend && alembic upgrade head
```

- App: http://localhost:8000
- Swagger: http://localhost:8000/docs
- PostgreSQL: puerto 5432 (`tickets_user`/`tickets_pass`/`tickets_db`)

## Stack

- **Backend:** Python 3.12 + FastAPI + SQLModel
- **Frontend:** HTML5 + Vanilla JS (ES modules) + SCSS
- **BD:** PostgreSQL 16
- **Infra:** Docker multi-stage (Node para SCSS → Python para app)

## Arquitectura

### Monolito con FastAPI sirviendo todo

FastAPI sirve la API REST (`/api/*`) y las páginas HTML como archivos estáticos (`/static`). Cada ruta de página (`/`, `/login`, `/tickets`, `/ticket/{id}`, `/crear`, `/usuarios`) retorna un `FileResponse` del HTML correspondiente. Archivos estáticos montados en `/static` desde `frontend/`.

### Patrón de imports

Todos los imports usan rutas absolutas desde raíz: `from backend.app.models import ...`. El `WORKDIR` de Docker es `/app`.

### Inicialización de BD

`create_db_and_tables()` se ejecuta al arrancar (lifespan). Crea tablas vía SQLModel y ejecuta `seed_catalogos()` que inserta estados, categorías, prioridades y usuarios de prueba **solo si la BD está vacía** (verifica si existen estados).

### Tres roles con permisos diferenciados

- **Cliente:** crea tickets (sin categoría/prioridad), ve solo sus tickets, puede cancelar tickets pendientes
- **Developer:** ve tickets desde "Abierto", cambia estados de tickets asignados (En revisión → En proceso → Resuelto), no puede crear tickets
- **Senior:** todo lo anterior + clasificar (categoría/prioridad), asignar responsables, cerrar/rechazar, gestionar usuarios

Dependencias de auth: `get_current_user` (cualquier autenticado), `require_senior` (solo senior). Están en `backend/app/routers/auth.py`.

### Autenticación

Cookies firmadas con `itsdangerous.URLSafeTimedSerializer`. No JWT. Cookie `session` con user ID firmado, httponly, samesite=lax, 24h. El frontend (`api.js`) redirige a `/login` en 401, excepto en `/` y `/login`.

### Catálogos en BD (FK, no strings)

Categorías, prioridades y estados son tablas con seed fijo (sin CRUD). Los tickets referencian por FK (`categoria_id`, `prioridad_id`, `estado_id`). La API devuelve objetos `{id, nombre}` (y `color` para estados). Seed en `backend/app/database.py:seed_catalogos()`.

### Transiciones de estado (hardcodeadas por rol)

Definidas en `backend/app/routers/tickets.py` como dicts `TRANSICIONES_SENIOR`, `TRANSICIONES_DEVELOPER`, `TRANSICIONES_CLIENTE`. Se validan por nombre del estado, se resuelven a ID via `_get_estado_by_nombre()`. El frontend controla qué opciones mostrar en el select; el backend valida.

Validaciones especiales al cambiar estado:
- Pendiente → Abierto: requiere categoría + prioridad + al menos un asignado
- Pendiente → Rechazado: requiere motivo_rechazo no vacío
- Abierto → En revisión: requiere al menos un asignado

### Asignación M:N de responsables

Tabla `ticket_asignaciones` (M:N). Tabla `asignacion_historial` con snapshots JSON por fecha. Si se remueven todos los asignados, el ticket vuelve a "Pendiente". Endpoint `PUT /api/tickets/{id}/asignados` reemplaza la lista completa.

### Historial de estados

Tabla `estado_historial`. Se registra al crear ticket y en cada cambio de estado. El cliente ve sin nombres del ejecutor; developer/senior ven con nombres.

### Observaciones

Tabla `observaciones` con `contenido` y `tipo_observacion` (opcional). No se pueden agregar a tickets en estado Cerrado o Rechazado. Cualquier usuario autenticado puede agregar.

### Frontend JS

Cada página tiene su propio JS. `api.js` exporta `apiGet`, `apiPost`, `apiPatch`, `apiDelete` (no hay `apiPut` — los PUT a `/asignados` usan `fetch` directamente en `detalle.js` y `crear.js`).

`nav.js` consulta `/api/me` y expone `window.__userRole` y `window.__userId` para que otros scripts condicionen la UI. Los demás scripts definen localmente su propia función `waitForRole()` que hace polling de `window.__userRole` con `setInterval` antes de inicializar.

### Frontend: badges dinámicos

Los badges de estado usan `style="background-color: ${estado.color}"` con el color de la BD, no clases CSS. Los de prioridad usan un mapa JS local `PRIORIDAD_COLORS`.

### SCSS

Compilado en Docker build (stage 1 Node, stage 2 Python). `frontend/css/` está en `.gitignore` (generado). En desarrollo con volúmenes montados, compilar localmente con `sass`. Los parciales (`_variables`, `_layout`, `_forms`, `_tickets`, `_code-review`) se importan desde `main.scss`.

## Deploy

Railway con Dockerfile. Requiere PostgreSQL y variables `DATABASE_URL` + `SECRET_KEY`. Deploy automático al push.

## Usuarios de prueba (seed)

Se crean al iniciar si la BD está vacía: `cliente@demo.com`, `dev@demo.com`, `senior@demo.com` (contraseña: `demo123`).

## OpenSpec Workflows

Usar `/opsx:*` para gestionar cambios: explore → propose → apply → verify → sync → archive.
