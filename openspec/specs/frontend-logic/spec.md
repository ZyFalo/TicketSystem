# frontend-logic Specification

## Purpose
Define la lógica JavaScript del frontend: wrapper API, autenticación, creación de tickets, listado con filtros y detalle interactivo.

## Requirements

### Requirement: Wrapper API reutilizable (api.js)
El frontend SHALL exponer una función apiDelete para peticiones DELETE, necesaria para cancelar tickets.

#### Scenario: DELETE disponible
- **WHEN** cualquier página necesita hacer un DELETE
- **THEN** puede usar apiDelete(endpoint) desde api.js

#### Scenario: Rol disponible para todas las páginas
- **WHEN** cualquier página carga
- **THEN** el JS consulta /api/me y almacena el rol del usuario para condicionar la UI

### Requirement: Lógica de autenticación (auth.js)
El frontend SHALL manejar login y registro desde la página login.html, enviando los datos al API y redirigiendo a /tickets tras login exitoso.

#### Scenario: Login exitoso redirige
- **WHEN** el usuario completa el login correctamente
- **THEN** se redirige a la página de listado de tickets

#### Scenario: Error de login muestra mensaje
- **WHEN** las credenciales son incorrectas
- **THEN** se muestra un mensaje de error en la página sin recargar

### Requirement: Lógica de creación de ticket (crear.js)
El formulario SHALL ocultar campos de categoría, prioridad y asignados si el usuario es cliente.

#### Scenario: Cliente no ve campos de clasificación
- **WHEN** un cliente carga la página /crear
- **THEN** los campos categoría, prioridad y asignados están ocultos

#### Scenario: Ticket creado redirige a detalle
- **WHEN** el usuario envía el formulario de creación exitosamente
- **THEN** se redirige a /ticket/{id} del ticket recién creado

### Requirement: Lógica de listado con filtros (tickets.js)
El frontend SHALL cargar tickets desde GET /api/tickets con query params y re-renderizar la tabla cuando los filtros cambien.

#### Scenario: Filtro actualiza sin recarga
- **WHEN** el usuario cambia un filtro de estado, prioridad o categoría
- **THEN** se hace una nueva llamada al API con los query params y se actualiza la tabla

### Requirement: Lógica de detalle (detalle.js)
El detalle SHALL mostrar botón "Cancelar Ticket" para clientes con tickets en "Pendiente". SHALL mostrar motivo de rechazo para tickets rechazados. SHALL ocultar controles de estado para clientes. El detalle SHALL cargar el historial de estados desde GET /api/tickets/{id}/historial-estados y renderizarlo con fecha y estado. Para clientes, ocultar el nombre de quién ejecutó el cambio.

#### Scenario: Cliente ve botón cancelar en ticket pendiente
- **WHEN** un cliente ve su ticket en estado "Pendiente"
- **THEN** ve un botón "Cancelar Ticket" y no ve controles de estado

#### Scenario: Motivo de rechazo visible en detalle
- **WHEN** un ticket está en estado "Rechazado"
- **THEN** se muestra el motivo de rechazo en la vista de detalle

#### Scenario: Senior ve controles de asignación
- **WHEN** un senior accede al detalle de un ticket
- **THEN** ve el multi-select para asignar responsables y los controles de estado correspondientes a su rol

#### Scenario: Developer ve controles limitados
- **WHEN** un developer asignado accede al detalle
- **THEN** solo ve los controles de estado que su rol permite (En revisión→En proceso, En proceso→Resuelto)

#### Scenario: Historial de estados renderizado
- **WHEN** se carga el detalle de un ticket
- **THEN** se muestra la lista de cambios de estado ordenada DESC por fecha

#### Scenario: Cliente sin nombres
- **WHEN** un cliente ve el historial de estados
- **THEN** cada entrada muestra solo fecha y nombre del estado, sin el ejecutor

### Requirement: Selects dinámicos
Los selects de categoría, prioridad y estado en el frontend SHALL usar value=ID y mostrar el nombre. Al enviar al API se envía el ID.

#### Scenario: Select carga opciones con ID
- **WHEN** se carga un select de categoría
- **THEN** cada option tiene value=ID numérico y muestra el nombre

### Requirement: Badges con color de BD
Los badges de estado SHALL usar el color almacenado en la tabla estados en vez de clases CSS hardcodeadas.

#### Scenario: Badge con color dinámico
- **WHEN** se renderiza un badge de estado
- **THEN** usa style background-color con el color de la BD

### Requirement: Lógica de gestión de usuarios (usuarios.js)
El frontend SHALL cargar la lista de usuarios y permitir cambiar roles con un botón por fila.

#### Scenario: Cambiar rol actualiza sin recargar
- **WHEN** un senior pulsa Promover/Degradar en un usuario
- **THEN** el rol se actualiza vía API y la tabla refleja el cambio sin recargar la página
