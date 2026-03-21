# ticket-tracking Specification

## Purpose
TBD - created by archiving change sistema-tickets-soporte. Update Purpose after archive.
## Requirements
### Requirement: Listado de tickets
El sistema SHALL mostrar un listado de todos los tickets registrados con su información resumida (ID, título, estado, prioridad, categoría, fecha de creación).

#### Scenario: Listado completo
- **WHEN** un usuario autenticado accede al listado de tickets
- **THEN** el sistema muestra todos los tickets ordenados por fecha de creación (más recientes primero)

#### Scenario: Listado vacío
- **WHEN** no existen tickets en el sistema
- **THEN** el sistema muestra un mensaje indicando que no hay tickets registrados

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

### Requirement: Seguimiento visual de estados
El sistema SHALL diferenciar visualmente los tickets según su estado actual mediante indicadores de color o etiquetas.

#### Scenario: Indicador visual por estado
- **WHEN** el listado de tickets se muestra al usuario
- **THEN** cada ticket muestra un indicador visual distinto según su estado (Abierto, En revisión, En proceso, Resuelto, Cerrado)

### Requirement: Historial de tickets
El sistema SHALL mantener un registro consultable de todos los tickets creados, incluyendo los cerrados.

#### Scenario: Consulta de historial
- **WHEN** un usuario consulta el historial
- **THEN** el sistema muestra todos los tickets incluyendo los archivados/cerrados con sus fechas y resoluciones

