# frontend-styles Specification

## Purpose
Define el sistema de estilos SCSS del frontend: variables, layout, formularios, indicadores de estado y bloques de código.

## Requirements

### Requirement: Sistema de variables SCSS
El proyecto SHALL definir variables SCSS para colores primarios, secundarios, de estado, tipografía, espaciados y breakpoints en _variables.scss.

#### Scenario: Variables centralizadas
- **WHEN** se necesita cambiar el color primario del sistema
- **THEN** basta modificar una variable en _variables.scss para que se propague a toda la aplicación

### Requirement: Layout base
El proyecto SHALL definir un layout con nav superior, contenedor principal centrado y estilos base de tipografía en _layout.scss.

#### Scenario: Estructura consistente
- **WHEN** se navega entre cualquiera de las 6 páginas
- **THEN** la estructura visual (nav, contenedor, tipografía) es consistente

### Requirement: Estilos de formularios
El proyecto SHALL estilizar inputs, selects, textareas y botones con un diseño consistente en _forms.scss.

#### Scenario: Formularios uniformes
- **WHEN** se visualiza cualquier formulario (login, registro, crear ticket, observaciones)
- **THEN** todos los elementos de formulario tienen el mismo estilo visual

### Requirement: Indicadores visuales de estado
El proyecto SHALL diferenciar visualmente cada estado del ticket con colores distintos: Abierto (azul), En revisión (amarillo), En proceso (morado), Resuelto (verde), Cerrado (gris).

#### Scenario: Badge de estado en listado
- **WHEN** se muestra un ticket en el listado
- **THEN** su estado aparece como badge con el color correspondiente

### Requirement: Estilos de bloques de código
El proyecto SHALL estilizar los bloques de código con fondo diferenciado, fuente monoespaciada y override del tema de highlight.js para integración visual con el sistema.

#### Scenario: Código legible
- **WHEN** se muestra un fragmento de código en la vista de detalle
- **THEN** tiene fondo diferenciado, padding, bordes redondeados y fuente monoespaciada
