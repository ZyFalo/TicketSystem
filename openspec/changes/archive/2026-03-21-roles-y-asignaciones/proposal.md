## Why

El sistema actualmente no distingue entre tipos de usuario. El documento del docente habla de "usuarios" que reportan y "responsables/revisores" que gestionan, pero todos los usuarios autenticados pueden hacer todo. Se necesita materializar esa distinción con roles y un sistema de asignación que permita saber quién trabaja en cada ticket.

## What Changes

- Agregar campo `rol` al modelo Usuario ("senior" | "developer")
- Restringir endpoints según rol (crear/editar/cerrar tickets = senior; trabajar/resolver = developer asignado)
- Reemplazar campo `asignado_a` (FK simple) por relación M:N `TicketAsignacion` (múltiples responsables simultáneos)
- Agregar tabla `AsignacionHistorial` con snapshots por fecha de los responsables asignados
- Validar que un ticket debe tener al menos 1 asignado para salir del estado "Abierto"
- Si se remueven todos los asignados, el ticket vuelve a "Abierto"
- Exponer nombres de creador y asignados en listado, detalle y creación
- Creador no editable en ningún momento
- Agregar filtro "Mis tickets" en listado (tickets donde soy asignado)
- Endpoint `/api/me` devuelve el `rol` del usuario
- Panel `/usuarios` (solo seniors) para promover/degradar usuarios
- Frontend muestra/oculta acciones según rol del usuario logueado

## Capabilities

### New Capabilities

- `user-roles`: Sistema de roles (senior/developer) con permisos diferenciados por endpoint y transición de estado
- `ticket-assignments`: Asignación M:N de responsables con historial de cambios por fecha
- `user-management`: Panel de gestión de usuarios para seniors (promover/degradar roles)

### Modified Capabilities

- `user-auth`: UsuarioRead incluye campo `rol`, `/api/me` devuelve rol, registro crea developer por defecto
- `ticket-management`: Permisos por rol en crear/editar/cambiar estado, validación de asignados para transiciones, creador visible y no editable
- `ticket-tracking`: TicketRead incluye `creador_nombre` y lista de `asignados` con nombres, filtro "Mis tickets" por asignación
- `frontend-pages`: Nueva página `/usuarios`, detalle muestra creador/asignados/historial, nav muestra/oculta según rol
- `frontend-logic`: JS condiciona acciones según rol de `/api/me`

## Impact

- **Modelo:** Campo `rol` en Usuario, eliminar `asignado_a` de Ticket, 2 tablas nuevas (TicketAsignacion, AsignacionHistorial)
- **Migración:** Alembic para agregar campo, crear tablas y migrar datos de `asignado_a` existente
- **API:** Endpoints nuevos para asignaciones y gestión de usuarios, modificación de permisos en endpoints existentes
- **Frontend:** Nueva página `/usuarios`, cambios en todas las páginas para visibilidad de roles y asignados
