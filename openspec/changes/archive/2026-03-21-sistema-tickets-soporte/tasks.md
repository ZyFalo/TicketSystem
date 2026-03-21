## 1. Estructura del proyecto e infraestructura

- [ ] 1.1 Crear estructura de directorios (backend/app, backend/app/routers, frontend/html, frontend/js, frontend/scss)
- [ ] 1.2 Crear requirements.txt con dependencias (fastapi, uvicorn, sqlmodel, alembic, psycopg2-binary, python-multipart, passlib[bcrypt], itsdangerous)
- [ ] 1.3 Crear Dockerfile (Python base, instalar dart-sass, compilar SCSS, correr uvicorn)
- [ ] 1.4 Crear docker-compose.yml (servicios: app + postgres, volúmenes, variables de entorno)
- [ ] 1.5 Crear backend/app/config.py (Settings con Pydantic: DATABASE_URL, SECRET_KEY)

## 2. Base de datos y modelos

- [ ] 2.1 Crear backend/app/database.py (engine, create_db_and_tables, get_session)
- [ ] 2.2 Crear modelo Usuario en backend/app/models.py (id, nombre, email, password_hash, created_at)
- [ ] 2.3 Crear modelo Ticket en backend/app/models.py (id, titulo, descripcion, categoria, prioridad, estado, fragmento_codigo, lenguaje_codigo, resolucion, creado_por FK, asignado_a FK, created_at, updated_at)
- [ ] 2.4 Crear modelo Observacion en backend/app/models.py (id, ticket_id FK, autor_id FK, contenido, tipo_observacion, created_at)
- [ ] 2.5 Inicializar Alembic y generar migración inicial
- [ ] 2.6 Verificar que las tablas se crean correctamente con docker-compose up

## 3. Autenticación (user-auth)

- [ ] 3.1 Crear backend/app/routers/auth.py con endpoint POST /api/register (crear usuario, hashear contraseña)
- [ ] 3.2 Crear endpoint POST /api/login (verificar credenciales, crear sesión con cookie firmada)
- [ ] 3.3 Crear endpoint POST /api/logout (destruir sesión, eliminar cookie)
- [ ] 3.4 Crear endpoint GET /api/me (retornar usuario actual sin contraseña)
- [ ] 3.5 Crear dependencia get_current_user para proteger rutas (leer cookie, validar sesión, retornar 401 si no autenticado)
- [ ] 3.6 Crear frontend/html/login.html y frontend/js/auth.js (formulario login + registro)

## 4. CRUD de tickets (ticket-management)

- [ ] 4.1 Crear backend/app/routers/tickets.py con endpoint POST /api/tickets (crear ticket con estado "Abierto")
- [ ] 4.2 Crear endpoint GET /api/tickets/{id} (consultar ticket con observaciones)
- [ ] 4.3 Crear endpoint PATCH /api/tickets/{id} (actualizar campos editables, registrar updated_at)
- [ ] 4.4 Crear endpoint PATCH /api/tickets/{id}/estado (cambiar estado con validación de transiciones válidas)
- [ ] 4.5 Crear endpoint PATCH /api/tickets/{id}/resolver (cambiar a "Resuelto" con texto de resolución obligatorio)
- [ ] 4.6 Crear endpoint POST /api/tickets/{id}/observaciones (agregar observación, rechazar si ticket cerrado)
- [ ] 4.7 Implementar validación de transiciones de estado (Abierto→En revisión→En proceso→Resuelto→Cerrado)

## 5. Listado y seguimiento (ticket-tracking)

- [ ] 5.1 Crear endpoint GET /api/tickets (listado con query params: estado, prioridad, categoria, ordenado por fecha desc)
- [ ] 5.2 Crear frontend/html/tickets.html (tabla de tickets con columnas: ID, título, estado, prioridad, categoría, fecha)
- [ ] 5.3 Crear frontend/js/tickets.js (fetch al listado, renderizar tabla, indicadores visuales por estado con colores CSS)
- [ ] 5.4 Implementar filtros en frontend (selects para estado, prioridad, categoría que actualicen la consulta)

## 6. Revisión de código (code-review)

- [ ] 6.1 Integrar highlight.js en frontend (CSS del tema + JS de la librería)
- [ ] 6.2 Agregar campo de selección de lenguaje en el formulario de creación de ticket
- [ ] 6.3 Renderizar fragmentos de código con highlight.js en la vista de detalle del ticket
- [ ] 6.4 Implementar tipo de observación técnica (error lógico, sintaxis, variables, validación, organización, buenas prácticas) en el formulario de observaciones
- [ ] 6.5 Mostrar observaciones técnicas categorizadas junto al fragmento de código

## 7. Frontend: páginas y estilos

- [ ] 7.1 Crear frontend/scss/_variables.scss (paleta de colores, tipografía, espaciados, breakpoints)
- [ ] 7.2 Crear frontend/scss/_layout.scss (nav, contenedor principal, grid)
- [ ] 7.3 Crear frontend/scss/_forms.scss (inputs, selects, textareas, botones)
- [ ] 7.4 Crear frontend/scss/_tickets.scss (cards/filas de tickets, badges de estado con colores, badges de prioridad)
- [ ] 7.5 Crear frontend/scss/_code-review.scss (estilos para bloques de código, override de highlight.js theme)
- [ ] 7.6 Crear frontend/scss/main.scss (importar todos los partials)
- [ ] 7.7 Crear frontend/html/index.html (landing con descripción del sistema y enlaces a secciones)
- [ ] 7.8 Crear frontend/html/crear.html y frontend/js/crear.js (formulario de creación con campo de código opcional)
- [ ] 7.9 Crear frontend/html/detalle.html y frontend/js/detalle.js (vista completa del ticket: info, observaciones, código, resolución, cambio de estado)
- [ ] 7.10 Crear frontend/js/api.js (wrapper reutilizable para fetch con manejo de cookies, errores y JSON)
- [ ] 7.11 Implementar navegación compartida (nav con enlaces a inicio, crear, tickets, login/logout)

## 8. App principal y servir estáticos

- [ ] 8.1 Crear backend/app/main.py (FastAPI app, incluir routers, montar StaticFiles para frontend)
- [ ] 8.2 Configurar rutas catch-all para servir las páginas HTML según la URL solicitada
- [ ] 8.3 Verificar que /docs muestra Swagger UI con todos los endpoints documentados

## 9. Integración y deploy

- [ ] 9.1 Configurar compilación SCSS→CSS en el Dockerfile (dart-sass)
- [ ] 9.2 Probar flujo completo en docker-compose (register → login → crear ticket → seguimiento → observaciones → resolución → cerrar)
- [ ] 9.3 Configurar variables de entorno para Railway (DATABASE_URL, SECRET_KEY)
- [ ] 9.4 Deploy en Railway y verificar funcionamiento
- [ ] 9.5 Crear README.md con instrucciones de setup local y deploy
