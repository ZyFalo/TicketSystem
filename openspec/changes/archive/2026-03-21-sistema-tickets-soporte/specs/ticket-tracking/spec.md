## ADDED Requirements

### Requirement: Listado de tickets
El sistema SHALL mostrar un listado de todos los tickets registrados con su información resumida (ID, título, estado, prioridad, categoría, fecha de creación).

#### Scenario: Listado completo
- **WHEN** un usuario autenticado accede al listado de tickets
- **THEN** el sistema muestra todos los tickets ordenados por fecha de creación (más recientes primero)

#### Scenario: Listado vacío
- **WHEN** no existen tickets en el sistema
- **THEN** el sistema muestra un mensaje indicando que no hay tickets registrados

### Requirement: Filtrado de tickets
El sistema SHALL permitir filtrar tickets por estado, prioridad y categoría.

#### Scenario: Filtro por estado
- **WHEN** el usuario selecciona un estado en el filtro
- **THEN** el listado muestra únicamente tickets con ese estado

#### Scenario: Filtro por prioridad
- **WHEN** el usuario selecciona una prioridad en el filtro
- **THEN** el listado muestra únicamente tickets con esa prioridad

#### Scenario: Filtro por categoría
- **WHEN** el usuario selecciona una categoría en el filtro
- **THEN** el listado muestra únicamente tickets de esa categoría

#### Scenario: Filtros combinados
- **WHEN** el usuario aplica múltiples filtros simultáneamente
- **THEN** el listado muestra tickets que cumplen TODOS los filtros seleccionados

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
