## Why

El frontend es responsabilidad de Antigravity. Necesita construir todas las páginas HTML, estilos SCSS y lógica JS del sistema contra el contrato API definido en el cambio 1. Este cambio define qué debe construir Antigravity de forma independiente al backend.

## What Changes

- Crear 6 páginas HTML (index, login, crear, tickets, detalle, login)
- Crear sistema de estilos SCSS con partials organizados por módulo
- Crear lógica JS por página usando fetch() contra /api/*
- Integrar highlight.js para syntax highlighting en revisión de código
- Crear wrapper api.js reutilizable para todas las llamadas HTTP
- Implementar navegación compartida entre páginas

## Capabilities

### New Capabilities

- `frontend-pages`: Todas las páginas HTML del sistema con su estructura y contenido
- `frontend-styles`: Sistema SCSS con variables, layout, formularios, tickets y code review
- `frontend-logic`: JavaScript vanilla por página con fetch() al API

### Modified Capabilities

- `ticket-management`: Formulario de creación y vista de detalle con edición
- `ticket-tracking`: Tabla de listado con filtros e indicadores visuales de estado
- `code-review`: Syntax highlighting con highlight.js y formulario de observaciones técnicas
- `user-auth`: Formularios de login/registro y lógica de sesión en frontend

## Impact

- **Código nuevo:** frontend/html/ (6 archivos), frontend/js/ (5+ archivos), frontend/scss/ (6+ archivos)
- **Dependencias frontend:** highlight.js (CDN o local)
- **Integración:** Todas las páginas consumen endpoints /api/* definidos en el contrato
