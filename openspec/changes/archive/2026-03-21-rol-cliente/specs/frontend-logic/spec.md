## MODIFIED Requirements

### Requirement: Wrapper API reutilizable (api.js)
El frontend SHALL exponer una función apiDelete para peticiones DELETE, necesaria para cancelar tickets.

#### Scenario: DELETE disponible
- **WHEN** cualquier página necesita hacer un DELETE
- **THEN** puede usar apiDelete(endpoint) desde api.js

### Requirement: Lógica de creación de ticket (crear.js)
El formulario SHALL ocultar campos de categoría, prioridad y asignados si el usuario es cliente.

#### Scenario: Cliente no ve campos de clasificación
- **WHEN** un cliente carga la página /crear
- **THEN** los campos categoría, prioridad y asignados están ocultos

### Requirement: Lógica de detalle (detalle.js)
El detalle SHALL mostrar botón "Cancelar Ticket" para clientes con tickets en "Pendiente". SHALL mostrar motivo de rechazo para tickets rechazados. SHALL ocultar controles de estado para clientes.

#### Scenario: Cliente ve botón cancelar en ticket pendiente
- **WHEN** un cliente ve su ticket en estado "Pendiente"
- **THEN** ve un botón "Cancelar Ticket" y no ve controles de estado

#### Scenario: Motivo de rechazo visible en detalle
- **WHEN** un ticket está en estado "Rechazado"
- **THEN** se muestra el motivo de rechazo en la vista de detalle
