# catalog-tables Specification

## Purpose
Define las tablas de catalogo (categorias, prioridades, estados) que almacenan datos fijos consultados por el sistema de tickets.

## Requirements

### Requirement: Tabla de categorias
El sistema SHALL almacenar las categorias de tickets en una tabla `categorias` con campos id y nombre.

#### Scenario: Categorias disponibles desde BD
- **WHEN** se consulta GET /api/tickets/opciones
- **THEN** las categorias se cargan desde la tabla en vez de una lista hardcodeada

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
Las tablas de catalogo SHALL poblarse con datos fijos en la migracion. No hay CRUD -- los datos no se crean, editan ni eliminan desde la aplicacion.

#### Scenario: Seed en migracion
- **WHEN** se ejecuta la migracion
- **THEN** las tablas contienen las categorias, prioridades y estados predefinidos
