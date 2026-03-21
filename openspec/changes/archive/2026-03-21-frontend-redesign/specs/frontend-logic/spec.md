## MODIFIED Requirements

### Requirement: Badges con color de BD
Los badges de estado SHALL usar **clases CSS** basadas en el nombre del estado (`badge--pendiente`, `badge--abierto`, etc.) como método principal. El color de la BD MUST usarse solo como fallback inline si la clase no existe. La función `getBadgeEstado()` MUST generar `class="badge badge--{nombre-normalizado}"`.

#### Scenario: Badge con clase CSS prioritaria
- **WHEN** se renderiza un badge de estado
- **THEN** usa `class="badge badge--pendiente"` (o el estado correspondiente, normalizado a lowercase con guiones) y solo aplica `style="background-color"` como fallback

### Requirement: Lógica de autenticación (auth.js)
El frontend SHALL manejar login y registro con transiciones CSS entre formularios. El toggle MUST manipular clases CSS para activar/desactivar transiciones, no `display.none/flex` directamente. Los errores de login/registro MUST mostrarse usando el sistema de toasts.

#### Scenario: Login exitoso con toast
- **WHEN** el usuario completa el login correctamente
- **THEN** se redirige a /tickets (sin toast, la redirección es feedback suficiente)

#### Scenario: Error de login con toast
- **WHEN** las credenciales son incorrectas
- **THEN** se muestra un toast de error con el mensaje, no un texto rojo inline

## ADDED Requirements

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
