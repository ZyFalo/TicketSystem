## ADDED Requirements

### Requirement: Page load animations
Al cargar el contenido principal de cada página, los elementos SHALL animarse con fade-in escalonado (staggered) usando `animation-delay` incremental. La duración MUST ser sutil (200-400ms) para no interferir con la usabilidad.

#### Scenario: Carga de listado de tickets
- **WHEN** los tickets se renderizan en la tabla
- **THEN** las filas aparecen con un fade-in staggered (cada fila con 50ms de delay incremental)

#### Scenario: Carga de detalle de ticket
- **WHEN** el contenido del ticket se muestra
- **THEN** las secciones (header, descripción, código, gestión, historiales) aparecen secuencialmente con fade-in

### Requirement: Section show/hide transitions
Las secciones que se muestran/ocultan condicionalmente (clasificación senior, motivo rechazo, resolución, asignados) SHALL usar transiciones CSS (opacity + max-height) en vez de `display: none` instantáneo.

#### Scenario: Mostrar campo de resolución
- **WHEN** el usuario selecciona estado "Resuelto" en el detalle
- **THEN** la sección de resolución aparece con transición suave (expand + fade-in) en vez de aparecer instantáneamente

### Requirement: Interactive hover effects
Los elementos interactivos (botones, filas de tabla, cards, links de navbar) SHALL tener transiciones hover suaves (200-300ms) que den feedback visual al usuario.

#### Scenario: Hover en fila de tabla
- **WHEN** el usuario pasa el mouse sobre una fila en la tabla de tickets
- **THEN** la fila cambia suavemente de fondo con transición de 200ms

#### Scenario: Hover en botón primario
- **WHEN** el usuario pasa el mouse sobre un botón primario
- **THEN** el botón se eleva ligeramente (translateY) con sombra glow del color accent

### Requirement: Animated text cycle
El hero de la landing SHALL incluir un elemento que rota palabras automáticamente (ej: "código", "tickets", "equipos") con transición CSS de blur + slide vertical + fade. El ciclo MUST usar `setInterval` en JS vanilla y `@keyframes` CSS. El contenedor MUST animar su ancho con `transition` CSS para adaptarse a cada palabra.

#### Scenario: Rotación automática de palabras
- **WHEN** la landing carga y el hero es visible
- **THEN** la palabra destacada rota cada ~3 segundos con animación blur (filter: blur → blur(0)), slide (translateY), y fade (opacity)

#### Scenario: Ancho adaptable
- **WHEN** la palabra cambia de "código" a "equipos" (diferente longitud)
- **THEN** el contenedor inline ajusta su ancho suavemente con CSS transition

### Requirement: Login form transition
El toggle entre formulario de login y registro SHALL usar una transición CSS (opacity + transform) en vez de `display: none/flex`.

#### Scenario: Cambiar de login a registro
- **WHEN** el usuario hace clic en "Regístrate aquí"
- **THEN** el formulario de login hace fade-out y el de registro hace fade-in con transición suave
