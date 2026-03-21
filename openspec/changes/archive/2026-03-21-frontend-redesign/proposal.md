## Why

El frontend actual tiene un diseño genérico sin identidad visual: tipografía por defecto (Inter/system), paleta fría indigo sin personalidad, estilos inline masivos, dark mode roto en varias secciones, `alert()` como único feedback, sin animaciones ni estados de carga. La landing está vacía y el sidebar ocupa espacio horizontal valioso. Se necesita un rediseño completo desde cero para lograr una experiencia profesional, cohesiva y memorable.

## What Changes

- **BREAKING** Reemplazar sidebar lateral por **top navbar** horizontal en todas las páginas
- **BREAKING** Reemplazar paleta de colores completa: de indigo frío (#6366f1) a **naranja/cobre cálido** (~#e8764a) sobre fondo ultra-oscuro
- **BREAKING** Reescribir todos los archivos SCSS desde cero con nuevo sistema de variables y design tokens
- Integrar **tipografía dual** desde Google Fonts: serif display para headings + sans-serif para UI
- Implementar **sistema de toasts** para reemplazar todos los `alert()` del frontend
- Implementar **loading skeletons** animados para reemplazar textos "Cargando..."
- Agregar **animaciones y transiciones CSS** en carga de página, hover states, show/hide de secciones
- Implementar **toggle dark/light mode** con CSS variables y persistencia en localStorage
- Rediseñar **landing page** con contenido visual real: hero, feature cards, stats
- Rediseñar **login/registro** con transiciones entre formularios
- Rediseñar **listado de tickets** con tabla mejorada, filtros tipo pills, estados vacíos
- Rediseñar **detalle de ticket** eliminando todos los estilos inline, secciones dark-mode compatibles
- Rediseñar **crear ticket** con formulario limpio y consistente
- Rediseñar **gestión de usuarios** con tabla y badges de rol propios
- Eliminar todos los estilos inline del HTML y migrar a clases SCSS
- Corregir badges: sistema unificado con fondo translúcido + texto coloreado para ambos temas

## Capabilities

### New Capabilities
- `ui-toast-system`: Sistema de notificaciones toast (éxito, error, info) con auto-dismiss y animaciones CSS, reemplazando todos los `alert()` del frontend
- `ui-loading-states`: Loading skeletons animados y estados vacíos con diseño propio para tablas, detalle de ticket y formularios
- `ui-theme-toggle`: Toggle dark/light mode con CSS variables duales, botón en navbar y persistencia en localStorage
- `ui-animations`: Transiciones CSS para carga de página (fade-in staggered), show/hide de secciones, hover effects en cards/botones/filas

### Modified Capabilities
- `frontend-styles`: Reescritura completa de SCSS — nueva paleta (naranja/cobre), tipografía dual (Google Fonts), fondo ultra-oscuro, bordes ghost, design tokens
- `frontend-pages`: Reescritura de HTML de las 6 páginas — sidebar → top navbar, eliminar estilos inline, nuevas clases, restructuración de secciones
- `frontend-logic`: Adaptar JS para integrar toasts (reemplazar alert), skeletons (reemplazar texto loading), theme toggle, y animaciones de transición

## Impact

- **Frontend HTML** (`frontend/html/*.html`): Las 6 páginas se reescriben (estructura, clases, eliminación de inline styles)
- **Frontend SCSS** (`frontend/scss/*.scss`): Todos los parciales se reescriben desde cero + nuevos parciales para toasts, skeletons, theme, animaciones
- **Frontend JS** (`frontend/js/*.js`): Modificar todos los scripts para integrar toasts, skeletons y theme toggle. Agregar nuevo módulo `toast.js` y `theme.js`
- **Frontend assets**: Agregar Google Fonts via `<link>` en cada HTML
- **Backend**: Sin cambios. La API no se modifica.
- **Docker**: Sin cambios (SCSS sigue compilando igual via Node stage)
