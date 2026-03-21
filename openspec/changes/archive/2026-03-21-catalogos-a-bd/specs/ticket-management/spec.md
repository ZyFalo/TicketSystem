## MODIFIED Requirements

### Requirement: Campos del ticket
Cada ticket SHALL referenciar categoría, prioridad y estado mediante FK a tablas de catálogo en vez de strings libres.

#### Scenario: Ticket con FK a catálogos
- **WHEN** se crea un ticket con categoria_id, prioridad_id
- **THEN** el sistema valida que los IDs existen en las tablas correspondientes

#### Scenario: Estado por FK
- **WHEN** se cambia el estado de un ticket
- **THEN** el sistema resuelve el estado_id desde la tabla estados por nombre

### Requirement: Crear ticket de soporte
El endpoint POST /api/tickets SHALL recibir categoria_id y prioridad_id (int opcionales) en vez de strings.

#### Scenario: Cliente crea ticket sin clasificar
- **WHEN** un cliente envía POST /api/tickets sin categoria_id ni prioridad_id
- **THEN** el ticket se crea con estado_id correspondiente a "Pendiente"

#### Scenario: Senior crea ticket clasificado
- **WHEN** un senior envía POST /api/tickets con categoria_id y prioridad_id
- **THEN** el ticket se crea con las FK correspondientes
