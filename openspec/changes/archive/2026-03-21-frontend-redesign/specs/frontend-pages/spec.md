## MODIFIED Requirements

### Requirement: Página de inicio (index.html)
El sistema SHALL mostrar una landing page con hero section (título con tipografía serif display incluyendo un animated text cycle que rota palabras con transición blur+slide, subtítulo, CTAs), sección Bento Grid de funcionalidades (grid asimétrico con cards de diferentes tamaños, hover con CTA reveal), sección de testimonios con columnas scrolling vertical infinito. La página SHALL usar el layout de top navbar compartido.

#### Scenario: Landing con contenido visual
- **WHEN** un usuario accede a la raíz del sistema (/)
- **THEN** ve un hero con título editorial que incluye una palabra animada rotando (ej: "código", "tickets", "equipos"), CTAs (Crear Ticket, Ver Tickets), Bento Grid de funcionalidades, y sección de testimonios

#### Scenario: Animated text cycle en hero
- **WHEN** el hero se renderiza
- **THEN** una palabra del título rota automáticamente cada ~3 segundos con animación de blur + slide vertical + fade, y el contenedor ajusta su ancho suavemente

#### Scenario: Bento Grid de funcionalidades
- **WHEN** el usuario scrollea más allá del hero
- **THEN** ve un grid asimétrico con cards de diferentes tamaños mostrando funcionalidades clave (Crear Tickets, Revisión de Código, Seguimiento de Estados, Asignación de Responsables, Historial). Cada card tiene ícono SVG, título, descripción, y al hacer hover revela un CTA con transición suave

### Requirement: Página de login (login.html)
El sistema SHALL presentar formularios de login y registro centrados verticalmente sin navbar. El toggle entre formularios MUST usar transición CSS (opacity + transform), no `display:none`. El brand "DevSupport" SHALL usar la tipografía serif display.

#### Scenario: Formulario de login
- **WHEN** un usuario accede a /login
- **THEN** ve un formulario con campos email y contraseña, botón de envío, y el brand con tipografía editorial

#### Scenario: Alternar entre login y registro con transición
- **WHEN** el usuario hace clic en "Regístrate aquí"
- **THEN** el formulario de login hace fade-out y el de registro hace fade-in con transición CSS suave

### Requirement: Página de creación de ticket (crear.html)
El formulario SHALL estar contenido en un card centrado con `max-width`. Los separadores entre secciones MUST ser bordes CSS sutiles, no elementos `<hr>` con estilos inline. El textarea de código MUST usar fondo consistente con el tema (no #f9fafb hardcodeado).

#### Scenario: Formulario cliente limpio
- **WHEN** un cliente accede a /crear
- **THEN** ve un formulario limpio con campos título, descripción y código opcional, sin estilos inline visibles

#### Scenario: Formulario senior completo
- **WHEN** un senior accede a /crear
- **THEN** ve todos los campos con separadores estilizados entre secciones, categoría/prioridad en row, y checkboxes de asignados

### Requirement: Página de listado de tickets (tickets.html)
La tabla SHALL tener tratamiento visual de card con bordes ghost. Los filtros MUST estar en una fila compacta. El botón "Nuevo Ticket" MUST estar visible condicionalmente (cliente/senior). Los estados vacíos MUST mostrar ícono + mensaje diseñado.

#### Scenario: Listado con tabla dark premium
- **WHEN** un usuario autenticado accede a /tickets
- **THEN** ve la tabla con bordes sutiles, headers uppercase muted, row hover suave, y badges de estado/prioridad con clases CSS

### Requirement: Página de detalle de ticket (detalle.html)
El detalle SHALL mostrar secciones de rechazo y resolución con estilos dark-mode compatibles (fondos translúcidos con colores semánticos, no colores claros hardcodeados). Los historiales SHALL mostrarse lado a lado. Las secciones condicionales MUST usar transiciones CSS al aparecer/desaparecer. No SHALL haber atributos `style=""` en el HTML estático.

#### Scenario: Motivo de rechazo en dark mode
- **WHEN** un usuario ve un ticket rechazado en dark mode
- **THEN** el motivo se muestra en un card con fondo `rgba(239,68,68,0.08)` y borde `rgba(239,68,68,0.2)`, no con colores claros

#### Scenario: Resolución en dark mode
- **WHEN** un usuario ve un ticket resuelto con resolución
- **THEN** la resolución se muestra en un card con fondo verde translúcido compatible con dark mode

#### Scenario: Botón cancelar para cliente
- **WHEN** un cliente ve su ticket en estado "Pendiente"
- **THEN** ve un botón "Cancelar Ticket" estilizado con la clase `btn-danger`

### Requirement: Navegación compartida como Top Navbar
El navbar horizontal SHALL contener: logo (izquierda), links de navegación (centro), y zona de usuario con theme toggle + logout (derecha). Los links MUST adaptarse al rol. El link activo MUST tener indicador visual. En mobile, MUST colapsar a hamburger menu.

#### Scenario: Nav para cliente
- **WHEN** un cliente está autenticado
- **THEN** el navbar muestra logo, Tickets, Nuevo Ticket, Mis Tickets, y zona de usuario

#### Scenario: Nav para senior
- **WHEN** un senior está autenticado
- **THEN** el navbar muestra logo, Tickets, Nuevo Ticket, Usuarios, y zona de usuario

#### Scenario: Active state
- **WHEN** el usuario está en la página /tickets
- **THEN** el link "Tickets" en el navbar tiene un indicador visual activo (borde inferior o color diferente)

### Requirement: Página de gestión de usuarios (usuarios.html)
La tabla MUST usar el mismo estilo de tabla que tickets. Los badges de rol MUST tener clases propias (`badge--cliente`, `badge--developer`, `badge--senior`) con colores diferenciados, no reutilizar clases de estado.

#### Scenario: Badges de rol propios
- **WHEN** se muestra un usuario con rol "senior"
- **THEN** su badge usa la clase `badge--senior` con color diferenciado del badge de estado "Resuelto"
