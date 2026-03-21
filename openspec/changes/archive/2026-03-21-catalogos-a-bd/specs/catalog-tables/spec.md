## ADDED Requirements

### Requirement: Tabla de categorías
El sistema SHALL almacenar las categorías de tickets en una tabla `categorias` con campos id y nombre.

#### Scenario: Categorías disponibles desde BD
- **WHEN** se consulta GET /api/tickets/opciones
- **THEN** las categorías se cargan desde la tabla en vez de una lista hardcodeada

### Requirement: Tabla de prioridades
El sistema SHALL almacenar las prioridades en una tabla `prioridades` con campos id, nombre y orden.

#### Scenario: Prioridades ordenadas desde BD
- **WHEN** se consulta GET /api/tickets/opciones
- **THEN** las prioridades se cargan desde la tabla ordenadas por campo orden

### Requirement: Tabla de estados
El sistema SHALL almacenar los estados en una tabla `estados` con campos id, nombre y color.

#### Scenario: Estados disponibles desde BD
- **WHEN** se consulta GET /api/tickets/opciones
- **THEN** los estados se cargan desde la tabla con su color para badges

### Requirement: Datos fijos por seed
Las tablas de catálogo SHALL poblarse con datos fijos en la migración. No hay CRUD — los datos no se crean, editan ni eliminan desde la aplicación.

#### Scenario: Seed en migración
- **WHEN** se ejecuta la migración
- **THEN** las tablas contienen las categorías, prioridades y estados predefinidos
