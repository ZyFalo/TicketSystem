# ui-animations Specification

## Purpose
Definir las animaciones y transiciones CSS del frontend para mejorar la experiencia visual: fade-in escalonado en carga de paginas, transiciones suaves en secciones condicionales, efectos hover interactivos, ciclo animado de texto en el hero, y transiciones en formularios de login/registro.

## Requirements

### Requirement: Page load animations
Al cargar el contenido principal de cada pagina, los elementos SHALL animarse con fade-in escalonado (staggered) usando `animation-delay` incremental. La duracion MUST ser sutil (200-400ms) para no interferir con la usabilidad.

#### Scenario: Carga de listado de tickets
- **WHEN** los tickets se renderizan en la tabla
- **THEN** las filas aparecen con un fade-in staggered (cada fila con 50ms de delay incremental)

#### Scenario: Carga de detalle de ticket
- **WHEN** el contenido del ticket se muestra
- **THEN** las secciones (header, descripcion, codigo, gestion, historiales) aparecen secuencialmente con fade-in

### Requirement: Section show/hide transitions
Las secciones que se muestran/ocultan condicionalmente (clasificacion senior, motivo rechazo, resolucion, asignados) SHALL usar transiciones CSS (opacity + max-height) en vez de `display: none` instantaneo.

#### Scenario: Mostrar campo de resolucion
- **WHEN** el usuario selecciona estado "Resuelto" en el detalle
- **THEN** la seccion de resolucion aparece con transicion suave (expand + fade-in) en vez de aparecer instantaneamente

### Requirement: Interactive hover effects
Los elementos interactivos (botones, filas de tabla, cards, links de navbar) SHALL tener transiciones hover suaves (200-300ms) que den feedback visual al usuario.

#### Scenario: Hover en fila de tabla
- **WHEN** el usuario pasa el mouse sobre una fila en la tabla de tickets
- **THEN** la fila cambia suavemente de fondo con transicion de 200ms

#### Scenario: Hover en boton primario
- **WHEN** el usuario pasa el mouse sobre un boton primario
- **THEN** el boton se eleva ligeramente (translateY) con sombra glow del color accent

### Requirement: Animated text cycle
El hero de la landing SHALL incluir un elemento que rota palabras automaticamente (ej: "codigo", "tickets", "equipos") con transicion CSS de blur + slide vertical + fade. El ciclo MUST usar `setInterval` en JS vanilla y `@keyframes` CSS. El contenedor MUST animar su ancho con `transition` CSS para adaptarse a cada palabra.

#### Scenario: Rotacion automatica de palabras
- **WHEN** la landing carga y el hero es visible
- **THEN** la palabra destacada rota cada ~3 segundos con animacion blur (filter: blur -> blur(0)), slide (translateY), y fade (opacity)

#### Scenario: Ancho adaptable
- **WHEN** la palabra cambia de "codigo" a "equipos" (diferente longitud)
- **THEN** el contenedor inline ajusta su ancho suavemente con CSS transition

### Requirement: Login form transition
El toggle entre formulario de login y registro SHALL usar una transicion CSS (opacity + transform) en vez de `display: none/flex`.

#### Scenario: Cambiar de login a registro
- **WHEN** el usuario hace clic en "Registrate aqui"
- **THEN** el formulario de login hace fade-out y el de registro hace fade-in con transicion suave
