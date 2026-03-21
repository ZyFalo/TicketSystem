## MODIFIED Requirements

### Requirement: Filtrado de tickets
El endpoint GET /api/tickets SHALL aceptar query params opcionales: estado, prioridad, categoria. Los filtros se aplican con AND. El resultado se ordena por created_at descendente.

#### Scenario: Filtro por estado
- **WHEN** se envía GET /api/tickets?estado=Abierto
- **THEN** retorna solo tickets con estado "Abierto" ordenados por fecha desc

#### Scenario: Filtros combinados
- **WHEN** se envía GET /api/tickets?estado=En revisión&prioridad=Alta
- **THEN** retorna solo tickets que cumplen AMBOS filtros

#### Scenario: Sin filtros
- **WHEN** se envía GET /api/tickets sin query params
- **THEN** retorna todos los tickets ordenados por created_at descendente
