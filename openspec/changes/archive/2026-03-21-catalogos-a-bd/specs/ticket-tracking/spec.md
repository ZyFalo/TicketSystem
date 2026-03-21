## MODIFIED Requirements

### Requirement: Listado de tickets
El listado SHALL devolver objetos con {id, nombre} para categoría, prioridad y estado en vez de strings.

#### Scenario: Ticket con objetos anidados
- **WHEN** un usuario consulta GET /api/tickets
- **THEN** cada ticket incluye categoria: {id, nombre}, prioridad: {id, nombre}, estado: {id, nombre, color}

### Requirement: Filtrado de tickets
Los filtros SHALL aceptar IDs en vez de strings para estado, prioridad y categoría.

#### Scenario: Filtro por estado_id
- **WHEN** se envía GET /api/tickets?estado_id=2
- **THEN** retorna tickets con ese estado_id
