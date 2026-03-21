## MODIFIED Requirements

### Requirement: Página de detalle de ticket (detalle.html)
La vista de detalle SHALL mostrar el nombre del creador (no editable), la lista de responsables asignados y el historial de asignaciones agrupado por fecha.

#### Scenario: Detalle muestra creador y asignados
- **WHEN** un usuario accede al detalle de un ticket
- **THEN** ve el nombre del creador, la lista de asignados actuales y el historial de asignaciones

### Requirement: Navegación compartida
La nav SHALL mostrar u ocultar enlaces según el rol del usuario: "Nuevo Ticket" y "Usuarios" solo visibles para seniors.

#### Scenario: Nav para senior
- **WHEN** un senior está autenticado
- **THEN** la nav muestra Inicio, Nuevo Ticket, Tickets, Usuarios, Logout

#### Scenario: Nav para developer
- **WHEN** un developer está autenticado
- **THEN** la nav muestra Inicio, Tickets, Logout (sin Nuevo Ticket ni Usuarios)

## ADDED Requirements

### Requirement: Página de gestión de usuarios (usuarios.html)
El sistema SHALL presentar una página /usuarios solo accesible por seniors con tabla de usuarios y botón para cambiar rol.

#### Scenario: Panel de usuarios
- **WHEN** un senior accede a /usuarios
- **THEN** ve tabla con ID, nombre, email, rol actual y botón Promover/Degradar
