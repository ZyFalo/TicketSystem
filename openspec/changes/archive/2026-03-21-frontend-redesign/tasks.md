## 1. Design Tokens y Reset Base

- [x] 1.1 Crear `_tokens.scss` con CSS custom properties para dark mode (default): bg-base, bg-surface, bg-elevated, accent naranja/cobre, texto, bordes, semánticos, spacing, tipografía
- [x] 1.2 Agregar variables light mode en `[data-theme="light"]` dentro de `_tokens.scss`
- [x] 1.3 Crear `_reset.scss` con reset global, base styles de body, tipografía (DM Sans body, DM Serif Display headings), y enlaces
- [x] 1.4 Agregar links de Google Fonts (DM Serif Display, DM Sans, JetBrains Mono) con `font-display: swap` — preparar snippet HTML para todas las páginas

## 2. Componentes SCSS Core

- [x] 2.1 Crear `_navbar.scss` con top navbar horizontal sticky: logo izquierda, links centro, zona usuario derecha. Incluir hamburger menu responsive (< 768px)
- [x] 2.2 Crear `_layout.scss` con contenedor principal centrado (`max-width`), utilidades flex/spacing, y clases responsive
- [x] 2.3 Crear `_buttons.scss` separado de forms: primary (naranja accent), secondary (ghost border), danger (rojo translúcido), action (tabla), ghost
- [x] 2.4 Crear `_forms.scss` con inputs, selects (appearance:none + chevron SVG), textareas, labels, focus glow naranja
- [x] 2.5 Crear `_cards.scss` con card base (bordes ghost, fondo surface), card-compact, feature-card para landing
- [x] 2.6 Crear `_tables.scss` con tabla tickets/usuarios: headers uppercase muted, row hover sutil, bordes ghost, responsive overflow
- [x] 2.7 Crear `_badges.scss` unificado: clases `badge--pendiente`, `badge--abierto`, `badge--en-revision`, `badge--en-proceso`, `badge--resuelto`, `badge--cerrado`, `badge--rechazado`, `badge--cliente`, `badge--developer`, `badge--senior`, `badge--alta`, `badge--media`, `badge--baja`. Fondo translúcido + texto coloreado, funcional en ambos temas
- [x] 2.8 Crear `_code.scss` con bloques de código, override highlight.js, fondo diferenciado por tema

## 3. Componentes SCSS Nuevos

- [x] 3.1 Crear `_toasts.scss` con contenedor fijo (top-right), estilos de toast por tipo (success, error, info, warning), animaciones @keyframes slideIn y fadeOut
- [x] 3.2 Crear `_skeletons.scss` con skeleton-line, skeleton-rect, skeleton-circle, y animación @keyframes shimmer
- [x] 3.3 Crear `_animations.scss` con keyframes fade-in, slide-up, staggered-delay utilities, y clases de transición para show/hide de secciones
- [x] 3.4 Crear `_ticket-detail.scss` con estilos de detalle: header, sección rechazo (fondo rojo translúcido), sección resolución (fondo verde translúcido), historiales, observaciones
- [x] 3.5 Crear `_theme.scss` con estilos del toggle button y cualquier override específico de light mode no cubierto por tokens
- [x] 3.6 Crear `_testimonials.scss` con columnas de testimonios scrolling vertical infinito (CSS @keyframes), mask-image gradient, y responsive (3 cols → 2 → 1)
- [x] 3.7 Crear `_text-cycle.scss` con animaciones para el animated text cycle del hero: @keyframes blur-slide-in, blur-slide-out, transición de ancho del contenedor
- [x] 3.8 Crear `_bento.scss` con Bento Grid: CSS Grid asimétrico (grid-template-columns/rows), bento-card con hover effects (content translateY, icon scale, CTA reveal con opacity+translateY, overlay ::after), responsive (3 cols → 1 col en mobile)

## 4. Main SCSS y Compilación

- [x] 4.1 Reescribir `main.scss` con imports de todos los nuevos parciales en orden correcto
- [x] 4.2 Compilar SCSS localmente y verificar que no hay errores de sintaxis

## 5. Módulos JS Nuevos

- [x] 5.1 Crear `toast.js` con función `showToast(message, type)`: crea nodo DOM, inserta en contenedor, auto-dismiss con setTimeout, remueve del DOM tras animación de salida
- [x] 5.2 Crear `theme.js` con lectura de `localStorage.theme`, aplicación de `data-theme` en `<html>`, y función toggle. Debe ejecutarse lo antes posible para evitar flash
- [x] 5.3 Crear `text-cycle.js` con lógica de rotación de palabras: setInterval, medición de ancho (getBoundingClientRect), swap de clases CSS para animación blur+slide+fade

## 6. Reescritura de HTML — Navbar y Estructura

- [x] 6.1 Reescribir `index.html`: eliminar sidebar, agregar top navbar, hero section con tipografía serif + text cycle animado, Bento Grid de funcionalidades (5 cards con íconos SVG inline, títulos, descripciones, CTAs hover), sección de testimonios con columnas scrolling, CTAs. Agregar Google Fonts link. Eliminar todo `style=""`
- [x] 6.2 Reescribir `login.html`: eliminar toda referencia a sidebar, rediseñar formularios centrados con brand serif, agregar clases para transición login↔registro. Agregar Google Fonts link. Eliminar todo `style=""`
- [x] 6.3 Reescribir `crear.html`: reemplazar sidebar por navbar, limpiar formulario, eliminar `style=""`, reemplazar `<hr>` por separadores CSS, usar clases para secciones condicionales
- [x] 6.4 Reescribir `tickets.html`: reemplazar sidebar por navbar, rediseñar filtros, tabla con nuevas clases, agregar markup para skeleton y estado vacío. Eliminar todo `style=""`
- [x] 6.5 Reescribir `detalle.html`: reemplazar sidebar por navbar, eliminar todos los `style=""`, usar clases para sección rechazo/resolución/cancelar, restructurar historiales y observaciones
- [x] 6.6 Reescribir `usuarios.html`: reemplazar sidebar por navbar, usar nuevas clases de tabla y badges de rol. Eliminar todo `style=""`

## 7. Adaptación de JS Existente

- [x] 7.1 Actualizar `nav.js`: adaptar a estructura de top navbar, agregar detección de active state por pathname, configurar toggle de hamburger menu en mobile, integrar theme toggle
- [x] 7.2 Actualizar `auth.js`: reemplazar `display.none/flex` por manipulación de clases CSS para transición entre formularios login↔registro
- [x] 7.3 Actualizar `tickets.js`: importar `showToast`, modificar `getBadgeEstado`/`getBadgePrioridad` para usar clases CSS en vez de style inline, agregar skeleton al inicio, agregar estado vacío diseñado
- [x] 7.4 Actualizar `detalle.js`: importar `showToast`, reemplazar todos los `alert()` por toasts, modificar badges a clases CSS, agregar skeleton al inicio, eliminar createElement con estilos inline (resolución para cliente), usar clases para sección rechazo/resolución
- [x] 7.5 Actualizar `crear.js`: importar `showToast`, reemplazar `alert()` si existe, verificar que no haya estilos inline generados por JS
- [x] 7.6 Actualizar `usuarios.js`: importar `showToast` si hay alerts, modificar badges de rol para usar clases `badge--{rol}` en vez de clases de estado reutilizadas
- [x] 7.7 Agregar `apiPut` a `api.js` y refactorizar las llamadas `fetch` PUT crudas en `detalle.js` y `crear.js` para usar `apiPut`

## 8. Verificación y Pulido

- [x] 8.1 Compilar SCSS final y verificar que todas las páginas renderizan correctamente en dark mode
- [x] 8.2 Verificar light mode en todas las páginas: colores, badges, code blocks, toasts, skeletons
- [x] 8.3 Verificar responsive en todas las páginas: navbar hamburger, tablas scrollable, formularios stack vertical
- [x] 8.4 Verificar que no queda ningún `alert()` en el código JS
- [x] 8.5 Verificar que no queda ningún `style=""` en el HTML estático (excepto los generados dinámicamente por JS como fallback)
- [x] 8.6 Probar flujo completo: login → crear ticket → ver listado → detalle → cambiar estado → observaciones → logout
