## Context

Los tickets almacenan categoria, prioridad y estado como strings libres. Las opciones válidas están hardcodeadas en listas Python (`PRIORIDADES`, `CATEGORIAS`, `ESTADOS_VISIBLES`) y dicts (`TRANSICIONES_*`). Este cambio normaliza esos datos en tablas de catálogo con FK.

## Goals / Non-Goals

**Goals:**

- 3 tablas de catálogo con datos fijos (seed)
- Tickets referencian catálogos por FK en vez de string
- API devuelve nombres resueltos (no solo IDs) en las respuestas
- Frontend trabaja con IDs internamente, muestra nombres al usuario
- Transiciones siguen en código, validación en backend, control de flujo en frontend

**Non-Goals:**

- CRUD de catálogos (no se crean, editan ni eliminan desde el panel)
- Tablas de transiciones en BD (siguen hardcodeadas)
- Cambios en la lógica de roles o permisos

## Decisions

### 1. Modelos de catálogo

```python
class Categoria(SQLModel, table=True):
    __tablename__ = "categorias"
    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(unique=True)

class Prioridad(SQLModel, table=True):
    __tablename__ = "prioridades"
    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(unique=True)
    orden: int = 0

class Estado(SQLModel, table=True):
    __tablename__ = "estados"
    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(unique=True)
    color: str = "#6b7280"
```

### 2. Schemas de lectura para catálogos

```python
class CategoriaRead(SQLModel):
    id: int
    nombre: str

class PrioridadRead(SQLModel):
    id: int
    nombre: str
    orden: int

class EstadoRead(SQLModel):
    id: int
    nombre: str
    color: str
```

### 3. Ticket con FK

```python
class Ticket(TicketBase, table=True):
    categoria_id: int | None = Field(default=None, foreign_key="categorias.id")
    prioridad_id: int | None = Field(default=None, foreign_key="prioridades.id")
    estado_id: int = Field(foreign_key="estados.id")  # default se resuelve al crear
```

Se eliminan los campos string `categoria`, `prioridad`, `estado`.

### 4. TicketCreate y TicketRead

```python
class TicketCreate(SQLModel):
    titulo: str
    descripcion: str
    categoria_id: int | None = None
    prioridad_id: int | None = None
    fragmento_codigo: str | None = None
    lenguaje_codigo: str | None = None

class TicketRead(SQLModel):
    id: int
    titulo: str
    descripcion: str
    categoria: CategoriaRead | None
    prioridad: PrioridadRead | None
    estado: EstadoRead
    fragmento_codigo: str | None
    lenguaje_codigo: str | None
    resolucion: str | None
    motivo_rechazo: str | None
    creado_por: int | None
    creador_nombre: str | None
    asignados: list[UsuarioRead]
    created_at: datetime
    updated_at: datetime
```

La API devuelve objetos `{id, nombre}` para categoría/prioridad/estado, no strings.

### 5. Transiciones hardcodeadas con nombres

Las transiciones siguen como dicts en código. Se busca el estado por nombre en la tabla para resolver el ID:

```python
TRANSICIONES_SENIOR = {
    "Pendiente": ["Abierto", "Rechazado"],
    "Abierto": ["En revisión"],
    "Resuelto": ["Cerrado"],
}
# Al validar, se consulta estado.nombre para comparar
```

### 6. Endpoint /opciones adaptado

```python
@router.get("/tickets/opciones")
def opciones_filtro(current_user, db):
    estados = db.exec(select(Estado)).all()
    # Filtrar por rol
    visibles = [e for e in estados if e.nombre in ESTADOS_VISIBLES[current_user.rol]]
    categorias = db.exec(select(Categoria)).all()
    prioridades = db.exec(select(Prioridad).order_by(Prioridad.orden)).all()
    return { "estados": visibles, "categorias": categorias, "prioridades": prioridades }
```

Retorna objetos con `{id, nombre}` en vez de strings.

### 7. Frontend: selects con value=ID

```html
<option value="3">En revisión</option>
```

Los selects usan `value=id` y muestran el nombre. Al enviar al API, se envía el ID.

### 8. Frontend: badges con color de BD

En vez de clases CSS por nombre (`badge-abierto`), usar estilo inline con el color de la tabla:

```javascript
function getBadgeEstado(estado) {
  return `<span class="badge" style="background-color: ${estado.color}">${estado.nombre}</span>`;
}
```

### 9. Seed de datos

Migración Alembic inserta los datos fijos:

```
Categorías: Servidor, Base de Datos, Frontend, Bug, Consulta, Mejora, Revisión de código
Prioridades: Baja (orden=1), Media (orden=2), Alta (orden=3)
Estados: Pendiente (#f97316), Abierto (#3b82f6), En revisión (#f59e0b), En proceso (#8b5cf6), Resuelto (#10b981), Cerrado (#6b7280), Rechazado (#dc2626)
```

### 10. Migración de datos existentes

1. Crear tablas categorias, prioridades, estados
2. Insertar seed
3. Agregar columnas categoria_id, prioridad_id, estado_id a tickets
4. Poblar FKs consultando las tablas de catálogo por nombre
5. Eliminar columnas string categoria, prioridad, estado

## Risks / Trade-offs

- **[Migración destructiva]** → Se eliminan columnas string. Mitigación: la migración puebla las FK antes de eliminar.
- **[Transiciones por nombre]** → El código busca estados por nombre, no por ID. Si se renombra un estado en la BD sin actualizar el código, se rompe. Aceptable porque no hay CRUD de estados.
- **[API response más pesada]** → TicketRead ahora devuelve objetos anidados en vez de strings. Minor.
