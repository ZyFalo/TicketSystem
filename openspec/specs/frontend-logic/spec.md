# frontend-logic Specification

## Purpose
Define la lógica JavaScript del frontend: wrapper API, autenticación, creación de tickets, listado con filtros y detalle interactivo.

## Requirements

### Requirement: Wrapper API reutilizable (api.js)
El frontend SHALL exponer una función apiDelete para peticiones DELETE, necesaria para cancelar tickets.

#### Scenario: DELETE disponible
- **WHEN** cualquier página necesita hacer un DELETE
- **THEN** puede usar apiDelete(endpoint) desde api.js

#### Scenario: Rol disponible para todas las páginas
- **WHEN** cualquier página carga
- **THEN** el JS consulta /api/me y almacena el rol del usuario para condicionar la UI

### Requirement: Lógica de autenticación (auth.js)
El frontend SHALL manejar login y registro con transiciones CSS entre formularios. El toggle MUST manipular clases CSS para activar/desactivar transiciones, no `display.none/flex` directamente. Los errores de login/registro MUST mostrarse usando el sistema de toasts.

#### Scenario: Login exitoso con toast
- **WHEN** el usuario completa el login correctamente
- **THEN** se redirige a /tickets (sin toast, la redirección es feedback suficiente)

#### Scenario: Error de login con toast
- **WHEN** las credenciales son incorrectas
- **THEN** se muestra un toast de error con el mensaje, no un texto rojo inline

### Requirement: Lógica de creación de ticket (crear.js)
El formulario SHALL ocultar campos de categoría, prioridad y asignados si el usuario es cliente.

#### Scenario: Cliente no ve campos de clasificación
- **WHEN** un cliente carga la página /crear
- **THEN** los campos categoría, prioridad y asignados están ocultos

#### Scenario: Ticket creado redirige a detalle
- **WHEN** el usuario envía el formulario de creación exitosamente
- **THEN** se redirige a /ticket/{id} del ticket recién creado

### Requirement: Lógica de listado con filtros (tickets.js)
El frontend SHALL cargar tickets desde GET /api/tickets con query params y re-renderizar la tabla cuando los filtros cambien.

#### Scenario: Filtro actualiza sin recarga
- **WHEN** el usuario cambia un filtro de estado, prioridad o categoría
- **THEN** se hace una nueva llamada al API con los query params y se actualiza la tabla

### Requirement: Lógica de detalle (detalle.js)
El detalle SHALL mostrar botón "Cancelar Ticket" para clientes con tickets en "Pendiente". SHALL mostrar motivo de rechazo para tickets rechazados. SHALL ocultar controles de estado para clientes. El detalle SHALL cargar el historial de estados desde GET /api/tickets/{id}/historial-estados y renderizarlo con fecha y estado. Para clientes, ocultar el nombre de quién ejecutó el cambio.

#### Scenario: Cliente ve botón cancelar en ticket pendiente
- **WHEN** un cliente ve su ticket en estado "Pendiente"
- **THEN** ve un botón "Cancelar Ticket" y no ve controles de estado

#### Scenario: Motivo de rechazo visible en detalle
- **WHEN** un ticket está en estado "Rechazado"
- **THEN** se muestra el motivo de rechazo en la vista de detalle

#### Scenario: Senior ve controles de asignación
- **WHEN** un senior accede al detalle de un ticket
- **THEN** ve el multi-select para asignar responsables y los controles de estado correspondientes a su rol

#### Scenario: Developer ve controles limitados
- **WHEN** un developer asignado accede al detalle
- **THEN** solo ve los controles de estado que su rol permite (En revisión->En proceso, En proceso->Resuelto)

#### Scenario: Historial de estados renderizado
- **WHEN** se carga el detalle de un ticket
- **THEN** se muestra la lista de cambios de estado ordenada DESC por fecha

#### Scenario: Cliente sin nombres
- **WHEN** un cliente ve el historial de estados
- **THEN** cada entrada muestra solo fecha y nombre del estado, sin el ejecutor

### Requirement: Selects dinámicos
Los selects de categoría, prioridad y estado en el frontend SHALL usar value=ID y mostrar el nombre. Al enviar al API se envía el ID.

#### Scenario: Select carga opciones con ID
- **WHEN** se carga un select de categoría
- **THEN** cada option tiene value=ID numérico y muestra el nombre

### Requirement: Badges con color de BD
Los badges de estado SHALL usar **clases CSS** basadas en el nombre del estado (`badge--pendiente`, `badge--abierto`, etc.) como método principal. El color de la BD MUST usarse solo como fallback inline si la clase no existe. La función `getBadgeEstado()` MUST generar `class="badge badge--{nombre-normalizado}"`.

#### Scenario: Badge con clase CSS prioritaria
- **WHEN** se renderiza un badge de estado
- **THEN** usa `class="badge badge--pendiente"` (o el estado correspondiente, normalizado a lowercase con guiones) y solo aplica `style="background-color"` como fallback

### Requirement: Lógica de gestión de usuarios (usuarios.js)
El frontend SHALL cargar la lista de usuarios y permitir cambiar roles con un botón por fila.

#### Scenario: Cambiar rol actualiza sin recargar
- **WHEN** un senior pulsa Promover/Degradar en un usuario
- **THEN** el rol se actualiza vía API y la tabla refleja el cambio sin recargar la página

### Requirement: Módulo theme.js
El frontend SHALL incluir un módulo `theme.js` que maneje el toggle dark/light. MUST leer `localStorage.theme` al cargar, aplicar el atributo `data-theme` en `<html>`, y exportar una función para alternar el tema. MUST ejecutarse lo antes posible (script en `<head>` o inline) para evitar flash de tema incorrecto.

#### Scenario: Inicialización del tema
- **WHEN** cualquier página se carga
- **THEN** `theme.js` lee `localStorage.theme`, aplica `data-theme` en `<html>` si corresponde, y configura el botón de toggle en el navbar

### Requirement: Integración de toasts en todos los scripts
Todos los archivos JS que actualmente usan `alert()` SHALL importar `showToast` de `toast.js` y reemplazar cada `alert()` con la llamada correspondiente. Los `confirm()` MUST mantenerse (son bloqueantes por diseño para acciones destructivas como cancelar ticket).

#### Scenario: Detalle - guardar cambios
- **WHEN** el usuario guarda gestión del ticket exitosamente
- **THEN** se ejecuta `showToast('Cambios guardados', 'success')` en vez de `alert('Cambios guardados')`

#### Scenario: Detalle - error
- **WHEN** falla una operación en el detalle
- **THEN** se ejecuta `showToast(errorMessage, 'error')` en vez de `alert(errorMessage)`

#### Scenario: Usuarios - cambio de rol
- **WHEN** se cambia el rol exitosamente
- **THEN** se muestra toast de éxito (opcional, ya que la tabla se recarga)

### Requirement: Integración de skeletons en carga
Los scripts de `tickets.js` y `detalle.js` SHALL mostrar skeletons HTML al inicio y reemplazarlos con contenido real cuando la API responda. El skeleton MUST insertarse desde JS como HTML string con las clases de skeleton definidas en SCSS.

#### Scenario: Skeleton en tabla de tickets
- **WHEN** `tickets.js` inicia la carga
- **THEN** inserta filas skeleton en el `<tbody>` que se reemplazan al llegar los datos

#### Scenario: Skeleton en detalle
- **WHEN** `detalle.js` inicia la carga
- **THEN** inserta un skeleton de header + descripción que se reemplaza al cargar el ticket

### Requirement: Navegación con active state
`nav.js` SHALL detectar la URL actual (`window.location.pathname`) y agregar la clase `nav-link--active` al link correspondiente en el navbar.

#### Scenario: Link activo en tickets
- **WHEN** el usuario está en /tickets
- **THEN** el link "Tickets" en el navbar tiene la clase `nav-link--active`

#### Scenario: Link activo en detalle
- **WHEN** el usuario está en /ticket/5
- **THEN** el link "Tickets" en el navbar tiene la clase `nav-link--active` (match parcial de ruta)
