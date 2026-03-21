## 1. Estructura del proyecto

- [x] 1.1 Crear estructura de directorios: backend/app/, backend/app/routers/, frontend/html/, frontend/js/, frontend/scss/
- [x] 1.2 Crear backend/requirements.txt (fastapi, uvicorn[standard], sqlmodel, alembic, psycopg2-binary, python-multipart, passlib[bcrypt], itsdangerous)
- [x] 1.3 Crear backend/app/config.py con Pydantic Settings (DATABASE_URL, SECRET_KEY con defaults para desarrollo)

## 2. Docker

- [x] 2.1 Crear Dockerfile (python:3.12-slim, copiar backend, instalar requirements, CMD uvicorn)
- [x] 2.2 Crear docker-compose.yml (servicios: app puerto 8000, db PostgreSQL puerto 5432, volúmenes, variables de entorno)
- [x] 2.3 Verificar que docker-compose up levanta ambos servicios correctamente

## 3. Modelos SQLModel

- [x] 3.1 Crear backend/app/database.py (create_engine, get_session como dependency)
- [x] 3.2 Crear modelo Usuario en backend/app/models.py (id, nombre, email, password_hash, created_at) con variantes UsuarioCreate y UsuarioRead
- [x] 3.3 Crear modelo Ticket en backend/app/models.py (id, titulo, descripcion, categoria, prioridad, estado, fragmento_codigo, lenguaje_codigo, resolucion, creado_por FK, asignado_a FK, created_at, updated_at) con variantes TicketCreate, TicketRead, TicketUpdate
- [x] 3.4 Crear modelo Observacion en backend/app/models.py (id, ticket_id FK, autor_id FK, contenido, tipo_observacion, created_at) con variantes ObservacionCreate y ObservacionRead

## 4. Migraciones

- [x] 4.1 Inicializar Alembic (alembic init, configurar env.py con SQLModel metadata)
- [x] 4.2 Generar migración inicial y verificar que crea tablas correctamente

## 5. Contrato API (endpoints stub)

- [x] 5.1 Crear backend/app/main.py (FastAPI app, incluir routers, montar StaticFiles placeholder)
- [x] 5.2 Crear backend/app/routers/auth.py con stubs: POST /api/register, POST /api/login, POST /api/logout, GET /api/me
- [x] 5.3 Crear backend/app/routers/tickets.py con stubs: GET /api/tickets (con query params estado, prioridad, categoria), POST /api/tickets, GET /api/tickets/{id}, PATCH /api/tickets/{id}, PATCH /api/tickets/{id}/estado, PATCH /api/tickets/{id}/resolver
- [x] 5.4 Agregar stubs de observaciones en tickets.py: POST /api/tickets/{id}/observaciones, GET /api/tickets/{id}/observaciones
- [x] 5.5 Verificar que /docs muestra todos los endpoints con schemas correctos y que son interactivos
