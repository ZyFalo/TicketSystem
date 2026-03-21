## MODIFIED Requirements

### Requirement: Selects dinámicos
Los selects de categoría, prioridad y estado en el frontend SHALL usar value=ID y mostrar el nombre. Al enviar al API se envía el ID.

#### Scenario: Select carga opciones con ID
- **WHEN** se carga un select de categoría
- **THEN** cada option tiene value=ID numérico y muestra el nombre

### Requirement: Badges con color de BD
Los badges de estado SHALL usar el color almacenado en la tabla estados en vez de clases CSS hardcodeadas.

#### Scenario: Badge con color dinámico
- **WHEN** se renderiza un badge de estado
- **THEN** usa style background-color con el color de la BD
