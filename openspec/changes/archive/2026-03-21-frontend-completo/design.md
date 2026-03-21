## Context

Antigravity construye el frontend. El backend expone una API REST documentada en Swagger UI (/docs). El frontend debe consumir esa API usando Vanilla JS con fetch(). No se permite CSS frameworks (Tailwind, Bootstrap). Se usa SCSS compilado a CSS.

## Goals / Non-Goals

**Goals:**

- Interfaz clara, ordenada y funcional (RNF-01, RNF-02, RNF-04)
- Seguimiento visual de estados con colores/etiquetas (RNF-03)
- Syntax highlighting funcional para fragmentos de código
- Navegación intuitiva entre módulos
- Formularios validados del lado del cliente antes de enviar al API
- Wrapper api.js que centralice fetch(), manejo de errores y cookies

**Non-Goals:**

- Responsive design avanzado (nice-to-have, no requerido)
- Animaciones o transiciones complejas
- Modo oscuro
- PWA o service workers

## Decisions

### 1. Estructura de archivos JS por página

Cada página tiene su propio archivo JS. Un `api.js` compartido maneja todas las llamadas HTTP.

```
frontend/js/
├── api.js         ← export: get(), post(), patch(), del()
├── auth.js        ← login.html: login y registro
├── crear.js       ← crear.html: formulario de ticket
├── tickets.js     ← tickets.html: listado y filtros
└── detalle.js     ← detalle.html: ver ticket, observaciones, código, estados
```

### 2. api.js como wrapper de fetch

```javascript
// Centraliza: base URL, headers, manejo de cookies, errores
async function apiGet(path, params) { ... }
async function apiPost(path, body) { ... }
async function apiPatch(path, body) { ... }
```

Todas las páginas importan estas funciones. Si la API retorna 401, redirige a login.

### 3. SCSS con partials por módulo

```
frontend/scss/
├── main.scss           ← @use de todos los partials
├── _variables.scss     ← $primary, $danger, $spacing, $font-stack
├── _layout.scss        ← nav, main container, grid helpers
├── _forms.scss         ← inputs, selects, textareas, buttons
├── _tickets.scss       ← .ticket-card, .badge-estado, .badge-prioridad
└── _code-review.scss   ← pre/code blocks, hljs overrides
```

### 4. Indicadores visuales de estado con clases CSS

```css
.badge-abierto      { background: #3b82f6; }  /* azul */
.badge-en-revision  { background: #f59e0b; }  /* amarillo */
.badge-en-proceso   { background: #8b5cf6; }  /* morado */
.badge-resuelto     { background: #10b981; }  /* verde */
.badge-cerrado      { background: #6b7280; }  /* gris */
```

### 5. highlight.js desde CDN

Incluir desde CDN para simplificar. No requiere build step:
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.x/styles/github.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.x/highlight.min.js"></script>
```

### 6. Navegación compartida

Cada página incluye el mismo `<nav>` HTML. Sin framework de componentes, se repite manualmente o se inyecta con JS desde un template compartido.

## Risks / Trade-offs

- **[Nav duplicado en cada HTML]** → Aceptable para 6 páginas. Alternativa: un nav.js que inyecte el HTML, pero agrega complejidad.
- **[highlight.js desde CDN]** → Requiere internet. Mitigación: se puede copiar localmente si es necesario para demo offline.
- **[Validación JS duplica la del backend]** → Necesario para UX. El backend es la fuente de verdad; JS solo mejora la experiencia.
