## 1. Estilos SCSS

- [x] 1.1 Crear frontend/scss/_variables.scss (paleta de colores por estado, tipografía, espaciados, breakpoints)
- [x] 1.2 Crear frontend/scss/_layout.scss (nav superior, contenedor principal centrado, grid helpers, tipografía base)
- [x] 1.3 Crear frontend/scss/_forms.scss (inputs, selects, textareas, botones con estados hover/focus/disabled)
- [x] 1.4 Crear frontend/scss/_tickets.scss (filas/cards de tickets, badges de estado con colores, badges de prioridad)
- [x] 1.5 Crear frontend/scss/_code-review.scss (bloques pre/code, override tema highlight.js, contenedor de observaciones técnicas)
- [x] 1.6 Crear frontend/scss/main.scss (importar todos los partials con @use)

## 2. Lógica JS compartida

- [x] 2.1 Crear frontend/js/api.js (funciones apiGet, apiPost, apiPatch con manejo de JSON, cookies, errores, redirección 401 a login)

## 3. Página de inicio

- [x] 3.1 Crear frontend/html/index.html (landing con descripción del sistema, enlaces a secciones, nav compartida)

## 4. Autenticación

- [x] 4.1 Crear frontend/html/login.html (formularios de login y registro alternables, nav compartida)
- [x] 4.2 Crear frontend/js/auth.js (enviar login/registro al API, manejar errores, redirigir a /tickets tras login exitoso)

## 5. Creación de tickets

- [x] 5.1 Crear frontend/html/crear.html (formulario con título, descripción, categoría, prioridad, código opcional con selector de lenguaje, nav compartida)
- [x] 5.2 Crear frontend/js/crear.js (validar formulario, enviar a POST /api/tickets, redirigir a detalle del ticket creado)

## 6. Listado y seguimiento

- [x] 6.1 Crear frontend/html/tickets.html (tabla de tickets con columnas ID/título/estado/prioridad/categoría/fecha, selectores de filtro, nav compartida)
- [x] 6.2 Crear frontend/js/tickets.js (cargar tickets con GET /api/tickets, renderizar tabla con badges de estado, filtrar vía query params sin recargar)

## 7. Detalle del ticket

- [x] 7.1 Crear frontend/html/detalle.html (info completa del ticket, sección de código, historial de observaciones, controles de estado, formulario de observación, sección de resolución, nav compartida)
- [x] 7.2 Crear frontend/js/detalle.js (cargar ticket, aplicar highlight.js al código, cambiar estado vía PATCH, agregar observaciones sin recargar, gestionar resolución)

## 8. Navegación e integración

- [x] 8.1 Implementar nav compartida en todas las páginas (Inicio, Crear, Tickets, Login/Logout dinámico según sesión via GET /api/me)
- [x] 8.2 Integrar highlight.js (CSS tema + JS desde CDN, llamar hljs.highlightAll() en detalle.js)
