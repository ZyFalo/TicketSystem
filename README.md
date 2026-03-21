# Sistema de Tickets - Soporte Técnico y Revisión de Código

Sistema web para gestión de tickets de soporte técnico con módulo de revisión de fragmentos de código.

**Materia:** Programación Web II
**Docente:** Javier Ochoa

## Stack

- **Backend:** Python + FastAPI + SQLModel + Alembic
- **Frontend:** HTML5 + Vanilla JS + SCSS
- **Base de datos:** PostgreSQL
- **Infraestructura:** Docker + docker-compose

## Setup local

### Requisitos

- Docker y Docker Compose

### Levantar el proyecto

```bash
docker-compose up --build
```

La aplicación estará disponible en `http://localhost:8000`.

- **App:** http://localhost:8000
- **API Docs (Swagger):** http://localhost:8000/docs

### Detener el proyecto

```bash
docker-compose down
```

Para eliminar los datos de PostgreSQL:

```bash
docker-compose down -v
```

## Deploy en Railway

1. Conectar el repositorio a Railway
2. Railway detecta el `Dockerfile` automáticamente
3. Agregar servicio PostgreSQL desde el dashboard
4. Configurar variables de entorno:
   - `DATABASE_URL`: URL del PostgreSQL de Railway (se genera automáticamente al vincular)
   - `SECRET_KEY`: string largo y aleatorio para firmar sesiones
5. Deploy automático al hacer push

## Estructura del proyecto

```
├── backend/
│   ├── app/
│   │   ├── main.py          ← App FastAPI + rutas de páginas
│   │   ├── models.py        ← SQLModel (Usuario, Ticket, Observacion)
│   │   ├── database.py      ← Conexión PostgreSQL
│   │   ├── config.py        ← Settings (DATABASE_URL, SECRET_KEY)
│   │   └── routers/
│   │       ├── auth.py      ← Register, Login, Logout, Me
│   │       └── tickets.py   ← CRUD tickets, estados, observaciones
│   ├── alembic/             ← Migraciones de BD
│   └── requirements.txt
├── frontend/
│   ├── html/                ← Páginas (index, login, crear, tickets, detalle)
│   ├── js/                  ← Lógica por página + api.js wrapper
│   └── scss/                ← Estilos (compilados a CSS en Docker)
├── Dockerfile               ← Multi-stage: SCSS build + Python app
└── docker-compose.yml       ← App + PostgreSQL
```

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/register | Registrar usuario |
| POST | /api/login | Iniciar sesión |
| POST | /api/logout | Cerrar sesión |
| GET | /api/me | Usuario actual |
| GET | /api/tickets | Listar tickets (filtros: estado, prioridad, categoria) |
| POST | /api/tickets | Crear ticket |
| GET | /api/tickets/{id} | Obtener ticket |
| PATCH | /api/tickets/{id} | Actualizar ticket |
| PATCH | /api/tickets/{id}/estado | Cambiar estado |
| PATCH | /api/tickets/{id}/resolver | Resolver ticket |
| GET | /api/tickets/{id}/observaciones | Listar observaciones |
| POST | /api/tickets/{id}/observaciones | Agregar observación |
