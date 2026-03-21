# frontend-pages Specification

## Purpose
Define las páginas HTML del sistema: landing, login, creación de tickets, listado, detalle y navegación compartida.

## Requirements

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
El formulario SHALL adaptarse al rol: cliente ve título + descripción + código opcional. Senior ve título + descripción + categoría + prioridad + código + asignados.

#### Scenario: Formulario cliente
- **WHEN** un cliente accede a /crear
- **THEN** ve solo título, descripción y código opcional

#### Scenario: Formulario senior
- **WHEN** un senior accede a /crear
- **THEN** ve todos los campos incluyendo categoría, prioridad y asignados

### Requirement: Página de listado de tickets (tickets.html)
El sistema SHALL mostrar una tabla/listado de tickets con columnas: ID, título, estado (con badge de color), prioridad, categoría y fecha. Incluye filtros por estado, prioridad y categoría.

#### Scenario: Listado con filtros
- **WHEN** un usuario autenticado accede a /tickets
- **THEN** ve la tabla de tickets y los selectores de filtro

#### Scenario: Filtro actualiza la tabla
- **WHEN** el usuario selecciona un filtro
- **THEN** la tabla se actualiza mostrando solo los tickets que coinciden, sin recargar la página

### Requirement: Página de detalle de ticket (detalle.html)
El detalle SHALL mostrar el motivo de rechazo cuando el ticket está en estado "Rechazado". El cliente puede ver un botón "Cancelar" si el ticket está en "Pendiente". El detalle SHALL mostrar el historial de estados y el historial de asignaciones lado a lado (50%/50%) usando CSS puro. Para clientes, el historial de estados ocupa 100% (asignaciones ocultas).

#### Scenario: Motivo de rechazo visible
- **WHEN** un usuario ve un ticket con estado "Rechazado"
- **THEN** el motivo de rechazo se muestra en el detalle

#### Scenario: Botón cancelar para cliente
- **WHEN** un cliente ve su ticket en estado "Pendiente"
- **THEN** ve un botón "Cancelar Ticket" que elimina el ticket

#### Scenario: Layout 50/50 para senior/developer
- **WHEN** un senior o developer ve el detalle de un ticket
- **THEN** ve historial de estados a la izquierda (50%) e historial de asignaciones a la derecha (50%)

#### Scenario: Layout 100% para cliente
- **WHEN** un cliente ve el detalle de su ticket
- **THEN** ve solo el historial de estados ocupando el 100% del ancho

### Requirement: Navegación compartida
La nav SHALL adaptarse a tres roles: cliente ve Inicio + Nuevo Ticket + Mis Tickets + Logout. Developer ve Inicio + Tickets + Logout. Senior ve Inicio + Nuevo Ticket + Tickets + Usuarios + Logout.

#### Scenario: Nav para cliente
- **WHEN** un cliente está autenticado
- **THEN** la nav muestra Inicio, Nuevo Ticket, Mis Tickets, Logout

#### Scenario: Nav para developer
- **WHEN** un developer está autenticado
- **THEN** la nav muestra Inicio, Tickets, Logout

#### Scenario: Nav para senior
- **WHEN** un senior está autenticado
- **THEN** la nav muestra Inicio, Nuevo Ticket, Tickets, Usuarios, Logout

### Requirement: Página de gestión de usuarios (usuarios.html)
El sistema SHALL presentar una página /usuarios solo accesible por seniors con tabla de usuarios y botón para cambiar rol.

#### Scenario: Panel de usuarios
- **WHEN** un senior accede a /usuarios
- **THEN** ve tabla con ID, nombre, email, rol actual y botón Promover/Degradar
