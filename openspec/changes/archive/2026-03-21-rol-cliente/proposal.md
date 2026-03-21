## Why

El documento del docente describe un sistema donde "los usuarios registran solicitudes de soporte" y "los responsables las revisan". Actualmente solo senior puede crear tickets, lo cual invierte la lógica del documento. Se necesita un rol "cliente" que represente al usuario que pide ayuda — crea tickets sin clasificarlos — y un flujo donde el senior revisa, clasifica y delega antes de que entre al ciclo de trabajo.

## What Changes

- Agregar rol "cliente" como default al registrarse (antes era "developer")
- Cliente puede crear tickets con campos reducidos (título, descripción, código opcional — sin categoría ni prioridad)
- Cliente solo ve sus propios tickets
- Cliente puede cancelar (eliminar) tickets en estado "Pendiente"
- Nuevo estado "Pendiente" como estado inicial de tickets creados por cliente
- Nuevo estado "Rechazado" con motivo obligatorio (solo senior)
- Campos `categoria` y `prioridad` pasan a ser opcionales (nullable)
- Nuevo campo `motivo_rechazo` en Ticket (nullable)
- Validación: Pendiente→Abierto requiere categoría + prioridad + al menos 1 asignado
- Validación: Pendiente→Rechazado requiere motivo de rechazo
- Developer solo ve tickets desde estado "Abierto" (excluye Pendiente y Rechazado)
- Transiciones actualizadas: developer ya no puede hacer Pendiente→nada; senior hace Pendiente→Abierto o Pendiente→Rechazado
- Listado ordenado por updated_at DESC, created_at DESC
- Formulario de creación diferente según rol (cliente vs senior)
- Nav adaptada para cliente: Inicio, Nuevo Ticket, Mis Tickets, Logout
- Panel de usuarios soporta tres roles: cliente ↔ developer ↔ senior

## Capabilities

### New Capabilities

- `client-role`: Rol cliente con permisos de creación de tickets y visibilidad limitada a tickets propios

### Modified Capabilities

- `user-roles`: Tres roles (cliente/developer/senior), registro default=cliente, transiciones actualizadas con Pendiente y Rechazado
- `user-auth`: Registro crea cliente por defecto
- `ticket-management`: Campos categoria/prioridad opcionales, estado inicial Pendiente, campo motivo_rechazo, DELETE para cancelar ticket, validaciones de clasificación
- `ticket-tracking`: Visibilidad filtrada por rol, ordenamiento por updated_at DESC
- `user-management`: Panel soporta tres roles
- `frontend-pages`: Formulario diferenciado por rol, nav para cliente, detalle muestra motivo de rechazo
- `frontend-logic`: JS condiciona formulario y visibilidad según rol cliente/developer/senior

## Impact

- **Modelo:** campo `motivo_rechazo` en Ticket, `categoria` y `prioridad` nullable, estado default "Pendiente", rol default "cliente"
- **Migración:** Alembic para nullable, nuevo campo, actualizar defaults
- **API:** DELETE /api/tickets/{id}, validaciones en /estado para Rechazado, filtro por rol en GET /api/tickets
- **Frontend:** formulario condicional, nav para cliente, motivo rechazo en detalle, visibilidad por rol
