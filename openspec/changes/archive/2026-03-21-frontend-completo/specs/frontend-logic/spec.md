## ADDED Requirements

### Requirement: Wrapper API reutilizable (api.js)
El frontend SHALL usar un módulo api.js que centralice todas las llamadas fetch() con manejo de JSON, cookies, errores HTTP y redirección a login en caso de 401.

#### Scenario: Llamada exitosa
- **WHEN** cualquier página hace una llamada API mediante api.js
- **THEN** recibe el JSON parseado de la respuesta

#### Scenario: Error 401 redirige a login
- **WHEN** una llamada API retorna 401
- **THEN** api.js redirige automáticamente a /login

#### Scenario: Error de servidor
- **WHEN** una llamada API retorna 4xx o 5xx (excepto 401)
- **THEN** api.js expone el error para que la página lo muestre al usuario

### Requirement: Lógica de autenticación (auth.js)
El frontend SHALL manejar login y registro desde la página login.html, enviando los datos al API y redirigiendo a /tickets tras login exitoso.

#### Scenario: Login exitoso redirige
- **WHEN** el usuario completa el login correctamente
- **THEN** se redirige a la página de listado de tickets

#### Scenario: Error de login muestra mensaje
- **WHEN** las credenciales son incorrectas
- **THEN** se muestra un mensaje de error en la página sin recargar

### Requirement: Lógica de creación de ticket (crear.js)
El frontend SHALL enviar los datos del formulario al API POST /api/tickets y redirigir al detalle del ticket creado.

#### Scenario: Ticket creado redirige a detalle
- **WHEN** el usuario envía el formulario de creación exitosamente
- **THEN** se redirige a /ticket/{id} del ticket recién creado

### Requirement: Lógica de listado con filtros (tickets.js)
El frontend SHALL cargar tickets desde GET /api/tickets con query params y re-renderizar la tabla cuando los filtros cambien.

#### Scenario: Filtro actualiza sin recarga
- **WHEN** el usuario cambia un filtro de estado, prioridad o categoría
- **THEN** se hace una nueva llamada al API con los query params y se actualiza la tabla

### Requirement: Lógica de detalle (detalle.js)
El frontend SHALL cargar el ticket completo, renderizar observaciones, aplicar highlight.js al código, y permitir cambiar estado y agregar observaciones.

#### Scenario: Agregar observación sin recargar
- **WHEN** el usuario envía una observación desde el formulario de detalle
- **THEN** la observación aparece en el historial sin recargar la página

#### Scenario: Cambio de estado desde detalle
- **WHEN** el usuario selecciona un nuevo estado válido
- **THEN** el estado se actualiza vía API y el badge visual cambia inmediatamente
