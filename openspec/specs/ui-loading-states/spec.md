# ui-loading-states Specification

## Purpose
Proveer componentes visuales de carga (skeletons animados) y estados vacios disenados para mejorar la experiencia de usuario durante la carga de datos y cuando no hay contenido disponible.

## Requirements

### Requirement: Loading skeleton components
El sistema SHALL proveer clases CSS para skeletons animados que sirvan como placeholders durante la carga de datos. Los shapes disponibles MUST incluir: `skeleton-line` (texto), `skeleton-rect` (bloque rectangular), `skeleton-circle` (avatar/icono).

#### Scenario: Skeleton de tabla en listado de tickets
- **WHEN** la pagina de tickets carga y los datos aun no llegan de la API
- **THEN** se muestran filas skeleton con rectangulos animados en cada columna, simulando la estructura de la tabla

#### Scenario: Skeleton en detalle de ticket
- **WHEN** se abre la pagina de detalle y el ticket aun no carga
- **THEN** se muestra un skeleton con lineas para titulo, rectangulo para descripcion, y badges placeholder

### Requirement: Shimmer animation
La animacion de los skeletons SHALL usar un gradiente que se desplaza horizontalmente (`@keyframes shimmer`) para dar sensacion de carga activa. La animacion MUST ser CSS pura.

#### Scenario: Gradiente animado
- **WHEN** un skeleton esta visible
- **THEN** muestra un gradiente translucido que se desplaza de izquierda a derecha en loop continuo

### Requirement: Empty states
Cuando una lista no tiene datos (tickets, observaciones, usuarios), el sistema SHALL mostrar un estado vacio disenado con icono SVG inline + mensaje descriptivo, no solo texto gris plano.

#### Scenario: Sin tickets encontrados
- **WHEN** el listado de tickets retorna vacio (por filtros o por rol)
- **THEN** se muestra un estado vacio centrado con icono y mensaje "No se encontraron tickets"

#### Scenario: Sin observaciones
- **WHEN** un ticket no tiene observaciones
- **THEN** se muestra un estado vacio con icono y mensaje "Aun no hay observaciones tecnicas"
