# Sistema de Tickets - Soporte Técnico y Revisión de Código

Sistema web para gestión de tickets de soporte técnico con módulo de revisión de fragmentos de código.

**Materia:** Programación Web II
**Desarrollador:** William Peña

## Stack

- **Backend:** Python + FastAPI + SQLModel
- **Frontend:** HTML5 + Vanilla JS (ES modules) + SCSS
- **Base de datos:** PostgreSQL
- **Infraestructura:** Docker multi-stage + docker-compose

## Roles

| Rol | Puede hacer |
|-----|-------------|
| **Cliente** | Crear tickets, ver sus tickets, cancelar tickets pendientes |
| **Developer** | Ver tickets asignados, cambiar estados (En revisión → En proceso → Resuelto), agregar observaciones |
| **Senior** | Todo lo anterior + clasificar tickets, asignar responsables, cerrar/rechazar, gestionar usuarios |

## Usuarios de prueba

Al iniciar por primera vez, se crean automáticamente:

| Email | Contraseña | Rol |
|-------|------------|-----|
| cliente@demo.com | demo123 | cliente |
| dev@demo.com | demo123 | developer |
| senior@demo.com | demo123 | senior |

## Setup local

### Requisitos

- Docker y Docker Compose

### Levantar el proyecto

```bash
docker-compose up --build
```

- **App:** http://localhost:8000
- **API Docs (Swagger):** http://localhost:8000/docs

### Detener

```bash
docker-compose down        # mantiene datos
docker-compose down -v     # borra datos de BD
```

## Deploy en Railway

1. Conectar el repositorio a Railway
2. Railway detecta el `Dockerfile` automáticamente
3. Agregar servicio PostgreSQL desde el dashboard
4. Configurar variables de entorno:
   - `DATABASE_URL`: URL del PostgreSQL de Railway
   - `SECRET_KEY`: string largo y aleatorio para firmar sesiones
5. Deploy automático al hacer push

## Flujo de estados

```
Cliente crea    Senior clasifica    Developer trabaja         Senior valida
     ↓                ↓                    ↓                       ↓
 Pendiente  →  Abierto  →  En revisión  →  En proceso  →  Resuelto  →  Cerrado
     ↓
 Rechazado (con motivo obligatorio)
```

## Estructura del proyecto

```
├── backend/
│   ├── app/
│   │   ├── main.py          ← App FastAPI + rutas de páginas
│   │   ├── models.py        ← SQLModel (Usuario, Ticket, catálogos, historial)
│   │   ├── database.py      ← Conexión PostgreSQL + seed de catálogos
│   │   ├── config.py        ← Settings (DATABASE_URL, SECRET_KEY)
│   │   └── routers/
│   │       ├── auth.py      ← Register, Login, Logout, Me
│   │       ├── tickets.py   ← CRUD tickets, estados, asignaciones, observaciones
│   │       └── usuarios.py  ← Gestión de roles (solo senior)
│   ├── alembic/             ← Migraciones de BD
│   └── requirements.txt
├── frontend/
│   ├── html/                ← Páginas (index, login, crear, tickets, detalle, usuarios)
│   ├── js/                  ← Lógica por página + api.js wrapper
│   └── scss/                ← Estilos (compilados a CSS en Docker)
├── Dockerfile               ← Multi-stage: Node (SCSS) + Python (app)
└── docker-compose.yml       ← App + PostgreSQL
```

## API Endpoints

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| POST | /api/register | Registrar usuario (siempre como cliente) | Público |
| POST | /api/login | Iniciar sesión | Público |
| POST | /api/logout | Cerrar sesión | Autenticado |
| GET | /api/me | Usuario actual (incluye rol) | Autenticado |
| GET | /api/tickets | Listar tickets (filtros: estado_id, prioridad_id, categoria_id, mis_tickets) | Autenticado |
| GET | /api/tickets/opciones | Categorías, prioridades y estados desde BD | Autenticado |
| POST | /api/tickets | Crear ticket | Cliente, Senior |
| GET | /api/tickets/{id} | Obtener ticket | Autenticado |
| PATCH | /api/tickets/{id} | Actualizar ticket (categoría, prioridad) | Senior |
| DELETE | /api/tickets/{id} | Cancelar ticket pendiente | Cliente (creador) |
| PATCH | /api/tickets/{id}/estado | Cambiar estado | Senior, Developer (asignado) |
| PUT | /api/tickets/{id}/asignados | Asignar responsables | Senior |
| GET | /api/tickets/{id}/asignados | Listar responsables | Autenticado |
| GET | /api/tickets/{id}/historial-estados | Historial de cambios de estado | Autenticado |
| GET | /api/tickets/{id}/historial-asignaciones | Historial de asignaciones | Autenticado |
| GET | /api/tickets/{id}/observaciones | Listar observaciones | Autenticado |
| POST | /api/tickets/{id}/observaciones | Agregar observación | Autenticado |
| GET | /api/usuarios | Listar usuarios | Senior |
| PATCH | /api/usuarios/{id}/rol | Cambiar rol de usuario | Senior |
