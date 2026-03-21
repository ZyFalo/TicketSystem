## ADDED Requirements

### Requirement: Loading skeleton components
El sistema SHALL proveer clases CSS para skeletons animados que sirvan como placeholders durante la carga de datos. Los shapes disponibles MUST incluir: `skeleton-line` (texto), `skeleton-rect` (bloque rectangular), `skeleton-circle` (avatar/icono).

#### Scenario: Skeleton de tabla en listado de tickets
- **WHEN** la página de tickets carga y los datos aún no llegan de la API
- **THEN** se muestran filas skeleton con rectángulos animados en cada columna, simulando la estructura de la tabla

#### Scenario: Skeleton en detalle de ticket
- **WHEN** se abre la página de detalle y el ticket aún no carga
- **THEN** se muestra un skeleton con líneas para título, rectángulo para descripción, y badges placeholder

### Requirement: Shimmer animation
La animación de los skeletons SHALL usar un gradiente que se desplaza horizontalmente (`@keyframes shimmer`) para dar sensación de carga activa. La animación MUST ser CSS pura.

#### Scenario: Gradiente animado
- **WHEN** un skeleton está visible
- **THEN** muestra un gradiente translúcido que se desplaza de izquierda a derecha en loop continuo

### Requirement: Empty states
Cuando una lista no tiene datos (tickets, observaciones, usuarios), el sistema SHALL mostrar un estado vacío diseñado con ícono SVG inline + mensaje descriptivo, no solo texto gris plano.

#### Scenario: Sin tickets encontrados
- **WHEN** el listado de tickets retorna vacío (por filtros o por rol)
- **THEN** se muestra un estado vacío centrado con ícono y mensaje "No se encontraron tickets"

#### Scenario: Sin observaciones
- **WHEN** un ticket no tiene observaciones
- **THEN** se muestra un estado vacío con ícono y mensaje "Aún no hay observaciones técnicas"
