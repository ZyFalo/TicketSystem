# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Proyecto académico para **Programación Web II** (Desarrollador: William Peña). Sistema de Tickets para Soporte Técnico y Revisión de Fragmentos de Código con tres roles (cliente, developer, senior). Documento de requerimientos original en `22Tickets.md`.

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

# Migraciones Alembic (desde dentro del contenedor o con el path correcto)
alembic -c backend/alembic/alembic.ini upgrade head
alembic -c backend/alembic/alembic.ini revision --autogenerate -m "descripcion"
```

- App: http://localhost:8000
- Swagger: http://localhost:8000/docs
- PostgreSQL: puerto 5432 (`tickets_user`/`tickets_pass`/`tickets_db`)

## Stack

- **Backend:** Python 3.12 + FastAPI + SQLModel + Alembic
- **Frontend:** HTML5 + Vanilla JS (ES modules) + SCSS
- **BD:** PostgreSQL 16
- **Infra:** Docker multi-stage (Node para SCSS → Python para app)

## Arquitectura

### Monolito con FastAPI sirviendo todo

FastAPI sirve la API REST (`/api/*`) y las páginas HTML como archivos estáticos (`/static`). Cada ruta de página (`/`, `/login`, `/tickets`, `/ticket/{id}`, `/crear`, `/usuarios`) retorna un `FileResponse` del HTML correspondiente. Lifespan hook en `main.py` ejecuta `create_db_and_tables()` al iniciar.

### Patrón de imports

Todos los imports usan rutas absolutas desde raíz: `from backend.app.models import ...`. El `WORKDIR` de Docker es `/app`.

### Tres roles con permisos diferenciados

- **Cliente:** crea tickets (sin categoría/prioridad), ve solo sus tickets, puede cancelar tickets pendientes
- **Developer:** ve tickets desde "Abierto", cambia estados de tickets asignados (En revisión → En proceso → Resuelto)
- **Senior:** todo lo anterior + clasificar (categoría/prioridad), asignar responsables, cerrar/rechazar, gestionar usuarios

Dependencias de auth: `get_current_user` (cualquier autenticado), `require_senior` (solo senior). Están en `backend/app/routers/auth.py`.

### Autenticación

Cookies firmadas con `itsdangerous.URLSafeTimedSerializer`. No JWT. Cookie `session` con user ID firmado, httponly, samesite=lax, 24h. El frontend (`api.js`) redirige a `/login` en 401, excepto en `/` y `/login`.

### Catálogos en BD (FK, no strings)

Categorías, prioridades y estados son tablas con seed fijo (sin CRUD). Los tickets referencian por FK (`categoria_id`, `prioridad_id`, `estado_id`). La API devuelve objetos `{id, nombre}` (y `color` para estados). Seed en `backend/app/database.py:seed_catalogos()`.

**Valores de catálogos (seed):**
- **Estados:** Pendiente, Abierto, En revisión, En proceso, Resuelto, Cerrado, Rechazado (cada uno con color hex)
- **Categorías:** Servidor, BD, Frontend, Bug, Consulta, Mejora, Revisión de código
- **Prioridades:** Baja (orden 1), Media (orden 2), Alta (orden 3)

### Transiciones de estado (hardcodeadas por rol)

Definidas en `backend/app/routers/tickets.py` como dicts `TRANSICIONES_SENIOR`, `TRANSICIONES_DEVELOPER`, `TRANSICIONES_CLIENTE`. Se validan por nombre del estado, se resuelven a ID via `_get_estado_by_nombre()`. El frontend controla qué opciones mostrar en el select; el backend valida.

**Requisitos para clasificar (Pendiente → Abierto):** el senior debe asignar `categoria_id`, `prioridad_id` y al menos 1 responsable antes de abrir. **Requisitos para rechazar (Pendiente → Rechazado):** requiere `motivo_rechazo` no vacío.

### Asignación M:N de responsables

Tabla `ticket_asignaciones` (M:N). Tabla `asignacion_historial` con snapshots JSON por fecha. Si se remueven todos los asignados, el ticket vuelve a "Pendiente". Endpoint `PUT /api/tickets/{id}/asignados` reemplaza la lista completa.

### Historial de estados

Tabla `estado_historial`. Se registra al crear ticket y en cada cambio de estado. El cliente ve sin nombres del ejecutor; developer/senior ven con nombres.

### Observaciones

Tabla `observaciones` con `ticket_id`, `autor_id`, `contenido`, `tipo_observacion`. Solo developer/senior pueden ver y agregar. Bloqueadas en tickets con estado Cerrado o Rechazado.

### Frontend JS

Cada página tiene su propio JS. `api.js` exporta `apiGet`, `apiPost`, `apiPatch`, `apiDelete`, `apiPut`. `nav.js` consulta `/api/me` y expone `window.__userRole` y `window.__userId` para que otros scripts condicionen la UI. Los demás scripts usan `waitForRole()` para esperar.

**Utilidades compartidas:** `theme.js` (dark/light toggle vía `data-theme` en `<html>`), `toast.js` (notificaciones con `showToast(msg, type)`), `text-cycle.js` (animación de palabras en landing).

**Archivo más complejo:** `detalle.js` (~400 líneas) maneja toda la lógica del detalle de ticket: cambio de estado, clasificación, asignados, observaciones, historial, cancelación, resolución — todo condicionado por rol.

### Frontend: badges dinámicos

Los badges de estado usan clases CSS normalizadas (`badge--pendiente`, `badge--en-proceso`, etc.) con colores definidos en `_tokens.scss`. Los de prioridad usan un mapa JS local `PRIORIDAD_COLORS`. La función `normalizeBadge(name)` quita acentos y reemplaza espacios por guiones.

### SCSS

Compilado en Docker build (stage 1 Node, stage 2 Python). En desarrollo con volúmenes montados, compilar localmente con `sass`. Los parciales se importan desde `main.scss`.

**Orden de imports en `main.scss`:** tokens → reset → layout/navbar → componentes (buttons, forms, cards, tables, badges, code) → features (toasts, skeletons, animations, ticket-detail, login) → landing (text-cycle, bento, testimonials) → theme (light mode overrides, al final por especificidad).

**Tema dark por defecto.** Variables CSS en `_tokens.scss`. Light mode se activa con `[data-theme="light"]` en `_theme.scss`.

## Deploy

Railway con Dockerfile. Requiere PostgreSQL y variables `DATABASE_URL` + `SECRET_KEY`. Deploy automático al push.

## Usuarios de prueba (seed)

Se crean al iniciar si la BD está vacía: `cliente@demo.com`, `dev@demo.com`, `senior@demo.com` (contraseña: `demo123`).

## OpenSpec Workflows

Usar `/opsx:*` para gestionar cambios: explore → propose → apply → verify → sync → archive.
