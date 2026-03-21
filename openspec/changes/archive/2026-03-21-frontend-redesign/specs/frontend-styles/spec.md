## MODIFIED Requirements

### Requirement: Sistema de variables SCSS
El proyecto SHALL definir design tokens como CSS custom properties (no SCSS variables) en `_tokens.scss` con dos esquemas: `:root` (dark, default) y `[data-theme="light"]`. Los tokens MUST cubrir: colores de fondo (base, surface, elevated), acento (naranja/cobre #e8764a), texto (primary, secondary, disabled), bordes, semánticos (success, error, warning, info), tipografía (display serif, body sans, mono), y spacing.

#### Scenario: Variables centralizadas con temas
- **WHEN** se necesita cambiar el color primario o el tema del sistema
- **THEN** basta modificar los CSS custom properties en `_tokens.scss` para que se propague a toda la aplicación en ambos temas

### Requirement: Layout base
El proyecto SHALL definir un layout con **top navbar** horizontal sticky, contenedor principal centrado (`max-width`) con padding responsive, y estilos base de tipografía en `_layout.scss`. El navbar MUST colapsar a hamburger menu en mobile (< 768px).

#### Scenario: Estructura consistente
- **WHEN** se navega entre cualquiera de las 6 páginas
- **THEN** la estructura visual (navbar superior, contenedor centrado, tipografía) es consistente

#### Scenario: Responsive mobile
- **WHEN** el viewport es menor a 768px
- **THEN** el navbar muestra un botón hamburger que despliega los links verticalmente

### Requirement: Indicadores visuales de estado
El proyecto SHALL diferenciar cada estado con **clases CSS** (no estilos inline). Cada estado MUST tener una clase `badge--{nombre}` con fondo translúcido + texto coloreado, funcional en ambos temas (dark y light).

#### Scenario: Badge de estado con clase CSS
- **WHEN** se muestra un badge de estado en cualquier página
- **THEN** usa la clase `badge--pendiente`, `badge--abierto`, etc., con colores definidos en SCSS que funcionan en dark y light mode

### Requirement: Estilos de bloques de código
El proyecto SHALL estilizar los bloques de código con fondo más oscuro que la surface, fuente monoespaciada (JetBrains Mono), y override del tema de highlight.js para integración visual con ambos temas del sistema.

#### Scenario: Código legible en ambos temas
- **WHEN** se muestra un fragmento de código en dark mode
- **THEN** tiene fondo #0a0a0e, fuente mono, padding generoso y bordes ghost
- **WHEN** se muestra un fragmento de código en light mode
- **THEN** tiene fondo #f0efed, misma fuente mono, mismos bordes adaptados

## ADDED Requirements

### Requirement: Tipografía dual con Google Fonts
El sistema SHALL cargar `DM Serif Display` (italic, para headings de impacto) y `DM Sans` (para body/UI) desde Google Fonts, y `JetBrains Mono` para código. La carga MUST usar `font-display: swap` para evitar FOIT.

#### Scenario: Fuentes cargadas
- **WHEN** se carga cualquier página
- **THEN** los headings principales usan DM Serif Display italic, el texto de UI usa DM Sans, y el código usa JetBrains Mono

### Requirement: SCSS reorganizado en parciales dedicados
Los estilos SHALL organizarse en parciales separados por responsabilidad: tokens, reset, navbar, layout, forms, buttons, cards, tables, badges, code, toasts, skeletons, animations, ticket-detail, theme. No SHALL haber mezcla de responsabilidades (ej: botones dentro de forms).

#### Scenario: Parcial dedicado por componente
- **WHEN** se necesita modificar el estilo de los badges
- **THEN** se edita solo `_badges.scss` sin afectar otros componentes

### Requirement: Zero inline styles
Ningún archivo HTML SHALL contener atributos `style=""` para diseño visual. Todo estilo visual MUST estar en clases SCSS. Los únicos `style` permitidos son los generados dinámicamente por JS para colores de BD como fallback.

#### Scenario: HTML limpio
- **WHEN** se inspecciona cualquier archivo HTML
- **THEN** no contiene atributos style para colores, margins, paddings, display, o font properties
