## ADDED Requirements

### Requirement: Página de inicio (index.html)
El sistema SHALL mostrar una landing page con descripción del sistema, su objetivo y enlaces a las secciones principales (crear ticket, ver tickets, login).

#### Scenario: Acceso a la landing
- **WHEN** un usuario accede a la raíz del sistema (/)
- **THEN** ve la descripción del sistema y enlaces de navegación a las secciones principales

### Requirement: Página de login (login.html)
El sistema SHALL presentar formularios de login y registro con campos email y contraseña (login) y nombre, email y contraseña (registro).

#### Scenario: Formulario de login
- **WHEN** un usuario accede a /login
- **THEN** ve un formulario con campos email y contraseña y un botón de envío

#### Scenario: Alternar entre login y registro
- **WHEN** el usuario está en la página de login
- **THEN** puede alternar entre el formulario de login y el de registro sin recargar la página

### Requirement: Página de creación de ticket (crear.html)
El sistema SHALL presentar un formulario con campos: título, descripción, categoría (select), prioridad (select), fragmento de código (textarea opcional) y lenguaje de programación (select, visible solo si hay código).

#### Scenario: Formulario completo
- **WHEN** un usuario autenticado accede a /crear
- **THEN** ve el formulario con todos los campos requeridos y opcionales

#### Scenario: Campo de código condicional
- **WHEN** el usuario activa la opción de incluir código
- **THEN** aparecen los campos de fragmento de código y selección de lenguaje

### Requirement: Página de listado de tickets (tickets.html)
El sistema SHALL mostrar una tabla/listado de tickets con columnas: ID, título, estado (con badge de color), prioridad, categoría y fecha. Incluye filtros por estado, prioridad y categoría.

#### Scenario: Listado con filtros
- **WHEN** un usuario autenticado accede a /tickets
- **THEN** ve la tabla de tickets y los selectores de filtro

#### Scenario: Filtro actualiza la tabla
- **WHEN** el usuario selecciona un filtro
- **THEN** la tabla se actualiza mostrando solo los tickets que coinciden, sin recargar la página

### Requirement: Página de detalle de ticket (detalle.html)
El sistema SHALL mostrar la información completa del ticket, sus observaciones, el fragmento de código (con syntax highlighting si aplica), controles para cambiar estado, formulario de observaciones y sección de resolución.

#### Scenario: Vista completa del ticket
- **WHEN** un usuario accede a /ticket/{id}
- **THEN** ve todos los campos del ticket, historial de observaciones, y controles de estado

#### Scenario: Código con syntax highlighting
- **WHEN** el ticket tiene fragmento de código
- **THEN** se renderiza con highlight.js aplicando el lenguaje indicado

### Requirement: Navegación compartida
Todas las páginas SHALL incluir una barra de navegación con enlaces a: Inicio, Crear Ticket, Ver Tickets, y Login/Logout según el estado de autenticación.

#### Scenario: Nav muestra estado de sesión
- **WHEN** el usuario está autenticado
- **THEN** la nav muestra su nombre y un enlace de logout en lugar del enlace de login
