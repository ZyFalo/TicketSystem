# ticket-tracking Specification

## Purpose
TBD - created by archiving change sistema-tickets-soporte. Update Purpose after archive.
## Requirements
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

### Requirement: Seguimiento visual de estados
El sistema SHALL diferenciar visualmente los tickets según su estado actual mediante indicadores de color o etiquetas.

#### Scenario: Indicador visual por estado
- **WHEN** el listado de tickets se muestra al usuario
- **THEN** cada ticket muestra un indicador visual distinto según su estado (Abierto, En revisión, En proceso, Resuelto, Cerrado)

### Requirement: Ordenamiento de tickets
El listado SHALL ordenarse por updated_at descendente, luego por created_at descendente.

#### Scenario: Tickets más recientes primero
- **WHEN** un usuario consulta el listado
- **THEN** los tickets con actualización más reciente aparecen primero

### Requirement: Historial de tickets
El sistema SHALL mantener un registro consultable de todos los tickets creados, incluyendo los cerrados.

#### Scenario: Consulta de historial
- **WHEN** un usuario consulta el historial
- **THEN** el sistema muestra todos los tickets incluyendo los archivados/cerrados con sus fechas y resoluciones

