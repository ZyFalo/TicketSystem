## Context

Proyecto nuevo sin código existente. Es un trabajo individual para la materia Programación Web II con 3 meses de plazo. El docente permite micro-frameworks (FastAPI aceptado) pero no frameworks pesados ni CSS frameworks (sin Tailwind/Bootstrap). El sistema debe dockerizarse para deploy en Railway.

La arquitectura es multi-page con API REST: FastAPI sirve archivos estáticos del frontend y expone endpoints JSON bajo `/api/`. Frontend usa Vanilla JS con `fetch()` para comunicarse con la API.

## Goals / Non-Goals

**Goals:**

- Sistema funcional de tickets con CRUD completo y flujo de estados
- Módulo de revisión de código con syntax highlighting
- Autenticación básica con sesiones
- Dockerización lista para Railway
- Código mantenible y organizado en módulos claros

**Non-Goals:**

- Ejecución automática de código del usuario
- Chat o comunicación en tiempo real
- Resolución automática de problemas
- Soporte para múltiples idiomas (i18n)
- Sistema de roles complejo (solo usuario y responsable)
- Notificaciones por email

## Decisions

### 1. FastAPI sobre Flask

**Decisión:** Usar FastAPI como micro-framework del backend.

**Alternativas consideradas:**
- **Flask:** Más maduro, mayor ecosistema. Pero diseñado para server-rendered pages, no API-first.
- **Python puro (http.server):** Sin dependencias, pero complejidad extrema para un proyecto de este alcance.

**Rationale:** FastAPI genera documentación Swagger automáticamente, valida datos con Pydantic, y su modelo de routers organiza bien una API REST. SQLModel (del mismo autor) unifica ORM y validación en una sola clase.

### 2. SQLModel como ORM

**Decisión:** Usar SQLModel en lugar de SQLAlchemy directo.

**Alternativas consideradas:**
- **SQLAlchemy directo:** Más control, pero requiere definir schemas Pydantic por separado.
- **SQL crudo:** Máximo control, pero propenso a errores y sin migraciones automáticas.

**Rationale:** SQLModel combina SQLAlchemy + Pydantic. Un solo modelo sirve como tabla de BD y como schema de validación de la API. Reduce duplicación significativamente.

### 3. PostgreSQL como base de datos

**Decisión:** PostgreSQL sobre SQLite o MySQL.

**Alternativas consideradas:**
- **SQLite:** Sin servidor, más simple. Pero limitado en concurrencia y Railway no lo persiste entre deploys.
- **MySQL:** Viable, pero Railway tiene soporte nativo más fluido para PostgreSQL.

**Rationale:** Railway provee PostgreSQL como servicio administrado con un click. Persistencia garantizada entre deploys. Tipos de datos ricos (JSONB para metadata futura).

### 4. Sesiones con cookies sobre JWT

**Decisión:** Autenticación basada en sesiones server-side con cookies.

**Alternativas consideradas:**
- **JWT:** Stateless, estándar para APIs separadas. Pero requiere manejo de refresh tokens y almacenamiento seguro en frontend.

**Rationale:** Frontend y API se sirven desde el mismo origen (mismo servidor FastAPI). No hay necesidad de JWT. Las sesiones son más simples y seguras para este contexto (sin XSS de tokens en localStorage).

### 5. SCSS compilado a CSS

**Decisión:** Escribir estilos en SCSS, compilar a CSS en el build de Docker.

**Alternativas consideradas:**
- **CSS plano:** Sin paso de compilación, pero sin variables, nesting ni partials.
- **CSS custom properties únicamente:** Variables nativas, pero sin nesting ni partials.

**Rationale:** SCSS ofrece organización (partials por módulo), variables y nesting. Se compila a CSS estándar que es lo que el docente espera ver en el navegador. `dart-sass` se instala en el Dockerfile como paso de build.

### 6. Multi-page sobre SPA

**Decisión:** Cada módulo es un archivo HTML independiente servido por FastAPI.

**Alternativas consideradas:**
- **SPA vanilla:** Experiencia más fluida, pero requiere router custom, state management y templating manual.
- **SPA con htmx:** Menos JS, pero añade una dependencia que podría interpretarse como framework.

**Rationale:** Multi-page reduce drásticamente la complejidad del JS. Cada página carga su propio script que usa `fetch()` contra la API. FastAPI sirve los archivos estáticos con `StaticFiles`. 3 meses de plazo individual hacen de la simplicidad una prioridad.

### 7. highlight.js para syntax highlighting

**Decisión:** Usar highlight.js como librería de syntax highlighting.

**Alternativas consideradas:**
- **Prism.js:** Similar en funcionalidad, ligeramente más configurable. Pero highlight.js tiene autodetección de lenguaje y setup más simple.
- **Sin highlighting:** Viable pero degrada la experiencia del módulo de revisión de código.

**Rationale:** Un include de CSS + JS y una llamada a `hljs.highlightAll()`. Complejidad mínima, valor alto para el módulo de revisión de código.

### 8. Estructura del proyecto

```
proyecto/
├── backend/
│   ├── app/
│   │   ├── main.py              ← App FastAPI + mount de estáticos
│   │   ├── models.py            ← SQLModel (Ticket, Usuario, Observacion)
│   │   ├── database.py          ← Engine + Session
│   │   ├── config.py            ← Settings con Pydantic
│   │   └── routers/
│   │       ├── tickets.py       ← CRUD /api/tickets
│   │       ├── auth.py          ← /api/login, /api/logout, /api/me
│   │       └── code_review.py   ← /api/tickets/{id}/review
│   ├── alembic/                 ← Migraciones
│   ├── alembic.ini
│   └── requirements.txt
├── frontend/
│   ├── html/
│   │   ├── index.html           ← Landing
│   │   ├── login.html           ← Autenticación
│   │   ├── crear.html           ← Formulario de ticket
│   │   ├── tickets.html         ← Listado + filtros
│   │   └── detalle.html         ← Ver ticket + observaciones + código
│   ├── js/
│   │   ├── api.js               ← Wrapper fetch() reutilizable
│   │   ├── auth.js              ← Login/logout
│   │   ├── crear.js             ← Lógica del formulario
│   │   ├── tickets.js           ← Listado y filtros
│   │   └── detalle.js           ← Detalle + observaciones + código
│   └── scss/
│       ├── main.scss            ← Importa todos los partials
│       ├── _variables.scss      ← Colores, fuentes, espaciados
│       ├── _layout.scss         ← Grid, nav, contenedores
│       ├── _forms.scss          ← Formularios
│       ├── _tickets.scss        ← Cards/tabla de tickets
│       └── _code-review.scss    ← Estilos para bloques de código
├── docker-compose.yml
├── Dockerfile
└── README.md
```

### 9. Modelo de datos

```
┌──────────────┐     ┌──────────────────┐     ┌───────────────┐
│   Usuario    │     │     Ticket       │     │  Observacion  │
├──────────────┤     ├──────────────────┤     ├───────────────┤
│ id (PK)      │     │ id (PK)          │     │ id (PK)       │
│ nombre       │◄────│ creado_por (FK)  │     │ ticket_id (FK)│
│ email        │◄────│ asignado_a (FK)  │     │ autor_id (FK) │
│ password_hash│     │ titulo           │     │ contenido     │
│ created_at   │     │ descripcion      │     │ created_at    │
└──────────────┘     │ categoria        │     └───────────────┘
                     │ prioridad        │            ▲
                     │ estado           │            │
                     │ fragmento_codigo │     ┌──────┴──────┐
                     │ created_at       │     │   Ticket    │
                     │ updated_at       │     │ tiene muchas│
                     │ resolucion       │     │ observaciones│
                     └──────────────────┘     └─────────────┘
```

## Risks / Trade-offs

- **[Sesiones sin Redis]** → Se usa almacenamiento en memoria (por defecto) o en BD. Para un proyecto académico con pocos usuarios concurrentes, es suficiente. Si escala, migrar a Redis.
- **[SCSS requiere compilación]** → Se agrega `dart-sass` al Dockerfile. Paso de build simple pero es una dependencia extra. Mitigación: se puede pre-compilar y commitear el CSS si causa problemas.
- **[FastAPI sirve estáticos]** → No es ideal para producción de alto tráfico. Para un proyecto académico es perfecto. Mitigación futura: poner Nginx delante.
- **[Sin sistema de roles granular]** → Cualquier usuario autenticado puede gestionar tickets. Suficiente para el alcance actual. Expandible con un campo `rol` en el modelo Usuario.
- **[highlight.js autodetección]** → No siempre acertada. Mitigación: permitir al usuario seleccionar el lenguaje al crear el ticket.
