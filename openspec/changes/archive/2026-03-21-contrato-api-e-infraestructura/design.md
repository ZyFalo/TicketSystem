## Context

Proyecto greenfield. No existe código. Este cambio establece la base para que frontend y backend se desarrollen independientemente. FastAPI genera Swagger UI automáticamente desde los modelos SQLModel/Pydantic, lo que permite documentar el contrato API sin esfuerzo adicional.

## Goals / Non-Goals

**Goals:**

- Infraestructura Docker funcional con un solo `docker-compose up`
- Modelos SQLModel que reflejen el dominio completo (Usuario, Ticket, Observacion)
- Migraciones Alembic ejecutables
- Todos los endpoints definidos con tipos correctos en Swagger UI
- Endpoints retornan stubs (datos mock) para que frontend pueda integrarse antes de tener backend real

**Non-Goals:**

- Implementar lógica de negocio real (eso es cambio 3: backend-completo)
- Construir frontend (eso es cambio 2: frontend-completo)
- Deploy en Railway (eso es cambio 4: integracion-y-deploy)

## Decisions

### 1. Endpoints stub con datos mock

Los endpoints retornan datos hardcodeados que cumplen el schema correcto. Esto permite que Swagger UI sea funcional y que el frontend se desarrolle contra respuestas reales.

**Alternativa considerada:** No crear stubs, solo definir schemas. Descartado porque Swagger no es interactivo sin endpoints reales.

### 2. Modelos SQLModel unificados

Un solo archivo `models.py` con modelos que sirven como tabla de BD Y como schema de API. Se crean variantes Read/Create/Update por modelo para controlar qué campos se exponen en cada operación.

```python
class TicketBase(SQLModel):
    titulo: str
    descripcion: str
    categoria: str
    prioridad: str

class Ticket(TicketBase, table=True):  # tabla BD
    id: int | None = Field(default=None, primary_key=True)
    estado: str = "Abierto"
    ...

class TicketCreate(TicketBase):  # body POST
    fragmento_codigo: str | None = None
    lenguaje_codigo: str | None = None

class TicketRead(TicketBase):  # response GET
    id: int
    estado: str
    created_at: datetime
    ...
```

### 3. Estructura de routers

Tres routers separados montados en el app principal:

```
/api/register, /api/login, /api/logout, /api/me  → auth.py
/api/tickets, /api/tickets/{id}, ...              → tickets.py
/api/tickets/{id}/observaciones                   → tickets.py (mismo router)
```

### 4. Docker multi-stage no necesario

Para desarrollo, un Dockerfile simple con Python base. La compilación SCSS se agrega en el cambio 4 (integración).

## Risks / Trade-offs

- **[Stubs divergen de implementación real]** → Mitigación: los stubs usan los mismos schemas Pydantic que la implementación final. Solo cambia el body de la función.
- **[Modelos pueden cambiar durante el desarrollo]** → Mitigación: Alembic maneja migraciones incrementales.
