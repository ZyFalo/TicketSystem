## MODIFIED Requirements

### Requirement: Listado de tickets
El sistema SHALL mostrar nombre del creador y nombres de los asignados en el listado de tickets para todos los usuarios.

#### Scenario: Listado muestra creador y asignados
- **WHEN** un usuario consulta GET /api/tickets
- **THEN** cada ticket incluye creador_nombre y lista de asignados con sus nombres

### Requirement: Filtrado de tickets
El endpoint GET /api/tickets SHALL aceptar un query param adicional mis_tickets=true que filtre por tickets donde el usuario actual está asignado.

#### Scenario: Filtro mis tickets
- **WHEN** un usuario envía GET /api/tickets?mis_tickets=true
- **THEN** retorna solo tickets donde el usuario actual es uno de los asignados

#### Scenario: Filtro mis tickets combinado
- **WHEN** un usuario envía GET /api/tickets?mis_tickets=true&estado=En proceso
- **THEN** retorna tickets asignados al usuario Y con estado "En proceso"
