# ui-theme-toggle Specification

## Purpose
Implementar un sistema dual de temas (dark/light) con toggle en el navbar, persistencia en localStorage, y badges compatibles con ambos temas para garantizar legibilidad y contraste en cualquier modo.

## Requirements

### Requirement: Dual theme system
El sistema SHALL soportar dos temas: dark (default) y light. Los temas MUST definirse mediante CSS variables en `:root` (dark) y `[data-theme="light"]`. Todos los colores del sistema MUST usar estas variables — ningun color hardcodeado en HTML o JS.

#### Scenario: Tema dark por defecto
- **WHEN** un usuario visita la app por primera vez (sin preferencia guardada)
- **THEN** se aplica el tema dark con fondo ultra-oscuro (#08080c) y acento naranja/cobre

#### Scenario: Tema light activado
- **WHEN** se activa el tema light
- **THEN** todos los fondos, textos, bordes y badges se adaptan al esquema claro sin romper legibilidad ni contraste

### Requirement: Theme toggle button
El navbar SHALL incluir un boton de toggle de tema (icono sol/luna) que alterne entre dark y light mode.

#### Scenario: Cambiar de dark a light
- **WHEN** el usuario hace clic en el boton de tema estando en dark mode
- **THEN** se establece `data-theme="light"` en `<html>`, el icono cambia a luna, y la preferencia se guarda en `localStorage`

#### Scenario: Cambiar de light a dark
- **WHEN** el usuario hace clic en el boton de tema estando en light mode
- **THEN** se remueve `data-theme` de `<html>`, el icono cambia a sol, y la preferencia se guarda en `localStorage`

### Requirement: Theme persistence
La preferencia de tema SHALL persistir en `localStorage` bajo la clave `theme`. Al cargar cualquier pagina, el sistema MUST leer esta preferencia y aplicar el tema correspondiente antes del primer render para evitar flash de tema incorrecto.

#### Scenario: Revisita con preferencia guardada
- **WHEN** un usuario con `localStorage.theme = "light"` abre cualquier pagina
- **THEN** el tema light se aplica inmediatamente sin flash de dark mode

### Requirement: Theme-compatible badges
Los badges de estado, prioridad y rol MUST usar colores que funcionen en ambos temas. En dark mode, fondo translucido claro + texto coloreado. En light mode, fondo translucido oscuro + texto coloreado ajustado para contraste.

#### Scenario: Badge de estado en light mode
- **WHEN** se renderiza un badge de estado "Pendiente" en light mode
- **THEN** el badge tiene fondo naranja translucido y texto naranja oscuro con contraste WCAG AA minimo
