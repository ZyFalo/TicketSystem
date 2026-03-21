## 1. Modelo y migración

- [x] 1.1 Agregar campo `rol` (str, default="developer") al modelo Usuario y a UsuarioRead
- [x] 1.2 Crear modelo TicketAsignacion (ticket_id PK+FK, usuario_id PK+FK, assigned_at)
- [x] 1.3 Crear modelo AsignacionHistorial (id PK, ticket_id FK, created_at, usuario_ids str, usuario_nombres str)
- [x] 1.4 Eliminar campo `asignado_a` y relación `asignado` del modelo Ticket
- [x] 1.5 Actualizar TicketRead: agregar creador_nombre (str|None) y asignados (list[UsuarioRead])
- [x] 1.6 Generar migración Alembic: agregar col rol, crear tablas, migrar datos de asignado_a, eliminar col asignado_a
- [x] 1.7 Eliminar campo `asignado_a` de TicketUpdate y TicketCreate

## 2. Autenticación y roles

- [x] 2.1 Crear dependencia require_senior en auth.py (403 si rol != "senior")
- [x] 2.2 Modificar /api/register para forzar rol="developer" siempre
- [x] 2.3 Modificar /api/me (UsuarioRead) para incluir campo rol en la respuesta

## 3. Permisos en endpoints de tickets

- [x] 3.1 Aplicar Depends(require_senior) a POST /api/tickets (crear)
- [x] 3.2 Aplicar Depends(require_senior) a PATCH /api/tickets/{id} (editar)
- [x] 3.3 Separar TRANSICIONES_VALIDAS en TRANSICIONES_SENIOR y TRANSICIONES_DEVELOPER
- [x] 3.4 Modificar PATCH /api/tickets/{id}/estado: verificar rol, si developer verificar que está asignado, consultar mapa correspondiente
- [x] 3.5 Modificar PATCH /api/tickets/{id}/resolver: solo developer asignado puede resolver
- [x] 3.6 Agregar validación: no permitir salir de "Abierto" si ticket no tiene asignados

## 4. Endpoints de asignación

- [x] 4.1 Crear PUT /api/tickets/{id}/asignados (solo senior): recibe lista de usuario_ids, reemplaza asignados, crea snapshot en historial
- [x] 4.2 Crear GET /api/tickets/{id}/asignados: retorna lista de UsuarioRead de asignados actuales
- [x] 4.3 Crear GET /api/tickets/{id}/historial-asignaciones: retorna lista de snapshots con fecha y nombres
- [x] 4.4 Implementar lógica: si lista queda vacía y ticket no está en "Abierto", volver a "Abierto"

## 5. Visibilidad de creador y asignados en API

- [x] 5.1 Modificar GET /api/tickets: llenar creador_nombre y asignados en cada TicketRead
- [x] 5.2 Modificar GET /api/tickets/{id}: llenar creador_nombre y asignados
- [x] 5.3 Agregar query param mis_tickets=true a GET /api/tickets: filtrar por TicketAsignacion del usuario actual

## 6. Gestión de usuarios (API)

- [x] 6.1 Crear GET /api/usuarios (solo senior): retorna lista de UsuarioRead con rol
- [x] 6.2 Crear PATCH /api/usuarios/{id}/rol (solo senior): alterna rol entre senior y developer

## 7. Frontend: panel de usuarios

- [x] 7.1 Crear frontend/html/usuarios.html (tabla de usuarios con botón Promover/Degradar, nav compartida)
- [x] 7.2 Crear frontend/js/usuarios.js (cargar usuarios, cambiar rol sin recargar)
- [x] 7.3 Agregar ruta /usuarios en main.py (FileResponse, solo visible en nav para seniors)

## 8. Frontend: visibilidad de roles y asignados

- [x] 8.1 Modificar nav.js: consultar /api/me, mostrar/ocultar "Nuevo Ticket" y "Usuarios" según rol
- [x] 8.2 Modificar tickets.js: mostrar creador_nombre y asignados en tabla, agregar filtro "Mis tickets"
- [x] 8.3 Modificar detalle.js: mostrar creador (no editable), lista de asignados, historial de asignaciones
- [x] 8.4 Modificar detalle.js: mostrar multi-select de asignación solo para seniors (PUT /api/tickets/{id}/asignados)
- [x] 8.5 Modificar detalle.js: filtrar controles de estado según rol y asignación del usuario actual
- [x] 8.6 Modificar crear.js: agregar multi-select de asignados al formulario de creación (solo seniors ven esta página)
