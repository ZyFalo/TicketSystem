## MODIFIED Requirements

### Requirement: Listado de tickets
El sistema SHALL filtrar el listado según el rol del usuario: cliente solo ve sus tickets, developer ve tickets desde estado "Abierto" (excluye Pendiente y Rechazado), senior ve todos.

#### Scenario: Cliente ve solo sus tickets
- **WHEN** un cliente consulta GET /api/tickets
- **THEN** retorna solo tickets donde creado_por es el usuario actual

#### Scenario: Developer excluye pendientes y rechazados
- **WHEN** un developer consulta GET /api/tickets
- **THEN** retorna tickets en estados Abierto, En revisión, En proceso, Resuelto, Cerrado

#### Scenario: Senior ve todos
- **WHEN** un senior consulta GET /api/tickets
- **THEN** retorna todos los tickets en cualquier estado

### Requirement: Ordenamiento de tickets
El listado SHALL ordenarse por updated_at descendente, luego por created_at descendente.

#### Scenario: Tickets más recientes primero
- **WHEN** un usuario consulta el listado
- **THEN** los tickets con actualización más reciente aparecen primero
