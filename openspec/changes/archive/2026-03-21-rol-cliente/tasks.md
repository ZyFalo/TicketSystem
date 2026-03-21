## 1. Modelo y migración

- [x] 1.1 Cambiar default de `rol` en Usuario de "developer" a "cliente"
- [x] 1.2 Hacer campos `categoria` y `prioridad` opcionales (str | None = None) en TicketBase
- [x] 1.3 Agregar campo `motivo_rechazo` (str | None = None) en modelo Ticket
- [x] 1.4 Agregar `motivo_rechazo` a TicketRead
- [x] 1.5 Cambiar default de `estado` en Ticket de "Abierto" a "Pendiente"
- [x] 1.6 Agregar campo `motivo_rechazo` a CambiarEstadoRequest (str | None = None)
- [x] 1.7 Generar migración Alembic: nullable categoria/prioridad, agregar motivo_rechazo, cambiar defaults

## 2. Autenticación

- [x] 2.1 Cambiar /api/register para forzar rol="cliente" (antes "developer")

## 3. Transiciones de estado

- [x] 3.1 Agregar TRANSICIONES_CLIENTE = {} (vacío)
- [x] 3.2 Actualizar TRANSICIONES_SENIOR: agregar "Pendiente": ["Abierto", "Rechazado"]
- [x] 3.3 Modificar endpoint /estado: si rol=="cliente" retornar 403, si Pendiente→Abierto validar que ticket tenga categoria + prioridad + asignados, si Pendiente→Rechazado validar motivo_rechazo obligatorio y guardarlo
- [x] 3.4 Agregar badge de color para estados "Pendiente" y "Rechazado" en _tickets.scss

## 4. Permisos de creación

- [x] 4.1 Modificar POST /api/tickets: permitir "cliente" y "senior" (denegar "developer" con 403)
- [x] 4.2 Cuando el creador es cliente: ignorar campos categoria, prioridad, estado siempre "Pendiente"

## 5. Cancelar ticket

- [x] 5.1 Crear DELETE /api/tickets/{id}: solo creador, solo estado "Pendiente", hard delete
- [x] 5.2 Retornar 400 si no está en Pendiente, 403 si no es el creador

## 6. Visibilidad por rol en listado

- [x] 6.1 Modificar GET /api/tickets: cliente solo ve creado_por=self, developer excluye Pendiente y Rechazado, senior ve todo
- [x] 6.2 Cambiar ordenamiento a updated_at DESC, created_at DESC

## 7. Panel de usuarios

- [x] 7.1 Actualizar PATCH /api/usuarios/{id}/rol para rotar entre tres roles: cliente→developer→senior→developer (o degradar developer→cliente)
- [x] 7.2 Actualizar frontend/js/usuarios.js: mostrar botones Promover/Degradar según rol actual (cliente→developer, developer→senior o developer→cliente, senior→developer)

## 8. Frontend: formulario de creación

- [x] 8.1 Modificar crear.js: consultar rol desde window.__userRole, ocultar categoría + prioridad + asignados si es cliente
- [x] 8.2 Modificar crear.html: envolver campos categoría, prioridad y asignados en divs con id para ocultarlos

## 9. Frontend: navegación

- [x] 9.1 Modificar nav.js: cliente ve Nuevo Ticket + Mis Tickets; developer ve solo Tickets; senior ve Nuevo Ticket + Tickets + Usuarios
- [x] 9.2 Actualizar todos los HTML: agregar enlace "Mis Tickets" oculto por defecto (id="nav-mis-tickets")

## 10. Frontend: detalle

- [x] 10.1 Modificar detalle.html: agregar sección motivo de rechazo (oculta por defecto) y botón "Cancelar Ticket" (oculto por defecto)
- [x] 10.2 Modificar detalle.js: mostrar motivo_rechazo si estado=="Rechazado", mostrar botón cancelar si cliente + estado=="Pendiente", ocultar controles de estado si rol=="cliente"
- [x] 10.3 Implementar lógica del botón cancelar: apiDelete → redirigir a /tickets
