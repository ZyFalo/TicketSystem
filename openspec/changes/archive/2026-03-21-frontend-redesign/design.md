## Context

El frontend actual usa un sidebar fijo de 260px, paleta indigo sobre slate (#0f172a), tipografía Inter/system, y está plagado de estilos inline en el HTML. El dark mode se rompe en varias secciones (rechazo, resolución, código en crear). No hay sistema de feedback visual (usa `alert()`), ni estados de carga, ni animaciones. La inspiración elegida es Capacity.so: fondo ultra-oscuro, acento naranja/cobre, tipografía editorial (serif+sans), bordes ghost, espaciado generoso.

Restricción dura: **no frameworks CSS** (Bootstrap, Tailwind). Todo en SCSS puro custom.

## Goals / Non-Goals

**Goals:**
- Rediseñar las 6 páginas del frontend con identidad visual propia y profesional
- Migrar de sidebar a top navbar en todas las páginas
- Implementar sistema de diseño coherente con CSS variables para dark/light mode
- Reemplazar `alert()` con toasts, "Cargando..." con skeletons, `display:none` con transiciones
- Eliminar 100% de estilos inline del HTML — todo vía clases SCSS
- Mantener la funcionalidad JS existente intacta (no cambiar lógica de negocio)

**Non-Goals:**
- No se modifica el backend (API, modelos, rutas)
- No se cambia la lógica de permisos/roles en JS (solo se adapta la integración visual)
- No se agrega un bundler/build tool JS (seguimos con ES modules vanilla)
- No se crea un SPA o sistema de routing client-side
- No se rediseña la documentación Swagger

## Decisions

### 1. Top Navbar en vez de Sidebar

**Decisión:** Reemplazar el sidebar fijo de 260px por un navbar horizontal sticky en la parte superior.

**Rationale:** El sidebar consume 260px de espacio horizontal que es valioso para tablas y formularios. El top navbar libera todo el ancho. En mobile, un navbar horizontal es más natural que un sidebar que hay que colapsar. La inspiración (Capacity) usa navegación superior.

**Alternativa descartada:** Sidebar colapsable — agrega complejidad JS innecesaria para un menú de 4-5 links.

**Estructura:**
```
┌───────────────────────────────────────────────┐
│ Logo    Tickets  Crear  Usuarios    [☀/🌙] User ▾ │
├───────────────────────────────────────────────┤
│                                               │
│              Contenido (100% ancho)           │
│                                               │
└───────────────────────────────────────────────┘
```

### 2. Sistema de Design Tokens con CSS Variables Duales

**Decisión:** Definir todas las variables en `:root` (dark, default) y `[data-theme="light"]` (light). El toggle cambia el atributo `data-theme` en `<html>` y persiste en `localStorage`.

**Rationale:** CSS variables permiten cambiar el tema sin recompilar SCSS. `data-theme` en `<html>` es el patrón más limpio y no requiere duplicar clases. `localStorage` persiste la preferencia entre sesiones.

**Alternativa descartada:** `prefers-color-scheme` media query sola — no da control al usuario para elegir.

### 3. Paleta Naranja/Cobre sobre Ultra-Oscuro

**Decisión:**
```
Dark mode (default):
  --bg-base: #08080c          (casi negro)
  --bg-surface: #111116       (cards, navbar)
  --bg-elevated: #1a1a21      (hover, dropdowns)
  --border: rgba(255,255,255,0.06)
  --accent: #e8764a           (naranja cobre)
  --accent-hover: #d4623a
  --accent-glow: rgba(232,118,74,0.25)
  --text-primary: #f0f0f2
  --text-secondary: #8a8a95
  --text-disabled: #555560

Light mode:
  --bg-base: #f8f7f5          (warm off-white)
  --bg-surface: #ffffff
  --bg-elevated: #f0efed
  --border: rgba(0,0,0,0.08)
  --accent: #d4623a           (un tono más profundo para contraste en fondo claro)
  --text-primary: #1a1a1f
  --text-secondary: #6b6b75
```

**Rationale:** Naranja/cobre da calidez y personalidad. El fondo ultra-oscuro (#08080c) crea más contraste que el slate actual (#0f172a). En light mode, el off-white cálido (#f8f7f5) mantiene coherencia con los tonos warm.

### 4. Tipografía: DM Serif Display + DM Sans

**Decisión:** Usar `DM Serif Display` (italic) para headings de impacto y `DM Sans` para body/UI. Ambas de Google Fonts. `JetBrains Mono` para código.

**Rationale:** DM Serif Display da el carácter editorial de la inspiración (como "Everything you need to ship"). DM Sans es su compañera natural — misma familia "DM", excelente legibilidad. JetBrains Mono es la estándar para código y ya está en los fallbacks actuales.

**Carga:** Via `<link>` de Google Fonts en cada HTML, con `font-display: swap` para no bloquear render.

**Alternativa descartada:** Cargar fuentes localmente (woff2) — agrega complejidad al build Docker sin beneficio real para un proyecto académico.

### 5. Arquitectura SCSS: Parciales Reorganizados

**Decisión:** Reestructurar los parciales SCSS:
```
frontend/scss/
├── main.scss              (imports)
├── _tokens.scss           (variables dark/light, tipografía, spacing)
├── _reset.scss            (reset + base styles)
├── _navbar.scss           (top navbar + responsive hamburger)
├── _layout.scss           (contenedores, grid, utilidades flex/spacing)
├── _forms.scss            (inputs, selects, textareas, labels)
├── _buttons.scss          (primary, secondary, danger, action, ghost)
├── _cards.scss            (card base, card-compact, feature-card)
├── _tables.scss           (tickets-table, row hover, responsive)
├── _badges.scss           (estados, prioridades, roles — unificados)
├── _code.scss             (code blocks, highlight theme override)
├── _toasts.scss           (sistema de notificaciones)
├── _skeletons.scss        (loading placeholders animados)
├── _animations.scss       (keyframes, transiciones, utility classes)
├── _ticket-detail.scss    (detalle de ticket, historiales, observaciones)
└── _theme.scss            (light mode overrides, toggle button)
```

**Rationale:** Separar mejor las responsabilidades. El actual mezcla buttons dentro de `_forms.scss` y badges dentro de `_tickets.scss`. Con parciales dedicados, es más fácil mantener y encontrar estilos.

### 6. Toasts: CSS-only con JS Mínimo

**Decisión:** Crear `toast.js` que exporta `showToast(message, type)`. El toast se inserta como nodo DOM en un contenedor fijo (`position: fixed; top; right`). Animación de entrada/salida con CSS (`@keyframes slideIn`, `fadeOut`). Auto-dismiss a 3s con `setTimeout`. Tipos: `success`, `error`, `info`, `warning`.

**Rationale:** No requiere librería. CSS animations son suficientes para este caso. El módulo se importa en cada script que actualmente usa `alert()`.

### 7. Loading Skeletons: CSS Puro

**Decisión:** Skeletons implementados con divs que tienen `background: linear-gradient(...)` animado con `@keyframes shimmer`. Shapes: rectangle, circle, text-line. Se insertan desde JS y se reemplazan al cargar datos.

**Rationale:** No requiere SVG ni canvas. Un gradiente animado es la implementación más ligera y se ve profesional.

### 8. Badges Unificados

**Decisión:** Los badges de estado dejan de usar `style="background-color"` inline. En su lugar, el JS asigna una clase basada en el nombre del estado (ej: `badge--pendiente`, `badge--abierto`). Los colores se definen en SCSS con fondo translúcido + texto coloreado, compatibles con ambos temas.

**Rationale:** Elimina los estilos inline. Permite que los badges se adapten al tema. Los colores de la BD (`estado.color`) se usan como fallback solo si no existe la clase.

**Impacto en JS:** Modificar `getBadgeEstado()` en `tickets.js` y `detalle.js` para generar `class="badge badge--${estado.nombre.toLowerCase().replace(' ', '-')}"` en vez de `style="background-color"`.

## Risks / Trade-offs

- **[Breaking visual]** El cambio de sidebar a navbar modifica la estructura HTML de 5 páginas. → Mitigación: hacer el cambio en todas las páginas de una sola pasada para evitar estado inconsistente.

- **[Google Fonts dependencia externa]** Si CDN de Google cae, las fuentes fallback a system. → Mitigación: definir fallbacks sólidos (`-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`). `font-display: swap` evita FOIT.

- **[Light mode puede revelar inconsistencias]** Elementos con colores hardcodeados no se adaptarán. → Mitigación: buscar y eliminar todo color hardcodeado del HTML y JS antes de implementar temas.

- **[Scope grande]** Tocar todas las páginas + todos los SCSS + todos los JS es un cambio amplio. → Mitigación: tasks ordenadas por dependencia — primero design tokens, luego componentes, luego páginas.
