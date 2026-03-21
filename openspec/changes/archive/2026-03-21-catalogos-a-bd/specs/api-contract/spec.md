## MODIFIED Requirements

### Requirement: Endpoint de opciones
El endpoint GET /api/tickets/opciones SHALL retornar objetos {id, nombre} para categorías, prioridades y estados, consultando las tablas de BD.

#### Scenario: Opciones con IDs
- **WHEN** un usuario consulta GET /api/tickets/opciones
- **THEN** retorna {estados: [{id, nombre, color}], categorias: [{id, nombre}], prioridades: [{id, nombre, orden}]}
