## Context

El sistema tiene dos roles (senior/developer) con asignación M:N. El senior crea tickets y el developer los resuelve. Esto contradice el documento del docente que dice que "el usuario" (quien necesita ayuda) crea tickets. Este cambio agrega un tercer rol "cliente" como creador de tickets, con un flujo de clasificación previo al trabajo.

## Goals / Non-Goals

**Goals:**

- Rol "cliente" como default al registrarse
- Tickets nacen en estado "Pendiente" sin clasificar
- Senior clasifica (categoría + prioridad + asignados) para pasar a "Abierto"
- Senior puede rechazar con motivo obligatorio
- Cliente solo ve sus tickets, developer solo ve desde "Abierto"
- Cliente puede cancelar tickets pendientes
- Formulario de creación adaptado por rol

**Non-Goals:**

- Notificaciones al cliente cuando su ticket cambia de estado
- Que el cliente pueda editar tickets después de crearlos
- Que el cliente pueda cambiar estados

## Decisions

### 1. Tres roles con default "cliente"

```python
class Usuario(UsuarioBase, table=True):
    rol: str = Field(default="cliente")  # "cliente" | "developer" | "senior"
```

El registro siempre crea "cliente". El panel de usuarios permite: cliente ↔ developer ↔ senior.

### 2. Estado "Pendiente" como default

```python
class Ticket(TicketBase, table=True):
    estado: str = Field(default="Pendiente")
```

Antes era "Abierto". Ahora "Pendiente" significa ticket crudo del cliente, "Abierto" significa clasificado y listo para trabajar.

### 3. Categoría y prioridad opcionales

```python
class TicketBase(SQLModel):
    titulo: str
    descripcion: str
    categoria: str | None = None
    prioridad: str | None = None
```

El cliente crea sin estos campos. El senior los llena al clasificar (Pendiente→Abierto).

### 4. Campo motivo_rechazo

```python
class Ticket(TicketBase, table=True):
    motivo_rechazo: str | None = None
```

Se llena obligatoriamente al rechazar. Se muestra al cliente en el detalle de su ticket.

### 5. Transiciones actualizadas

```python
TRANSICIONES_CLIENTE = {}

TRANSICIONES_SENIOR = {
    "Pendiente": ["Abierto", "Rechazado"],
    "Resuelto": ["Cerrado"],
}

TRANSICIONES_DEVELOPER = {
    "Abierto": ["En revisión"],
    "En revisión": ["En proceso"],
    "En proceso": ["Resuelto"],
}
```

### 6. Validaciones en cambio de estado

Pendiente → Abierto:
- Requiere `categoria` no null
- Requiere `prioridad` no null
- Requiere al menos 1 asignado en TicketAsignacion

Pendiente → Rechazado:
- Requiere `motivo_rechazo` en el request body (campo nuevo en CambiarEstadoRequest)

### 7. CambiarEstadoRequest ampliado

```python
class CambiarEstadoRequest(SQLModel):
    estado: str
    resolucion: str | None = None
    motivo_rechazo: str | None = None
```

### 8. DELETE /api/tickets/{id} para cancelar

Solo el cliente creador puede eliminar, solo si estado == "Pendiente". Eliminación real (hard delete), no soft delete.

### 9. Visibilidad en GET /api/tickets

```python
if current_user.rol == "cliente":
    query = query.where(Ticket.creado_por == current_user.id)
elif current_user.rol == "developer":
    query = query.where(Ticket.estado.not_in(["Pendiente", "Rechazado"]))
# senior ve todo
```

Ordenamiento: `order_by(Ticket.updated_at.desc(), Ticket.created_at.desc())`

### 10. Formulario condicional en frontend

El JS consulta `/api/me` y según `rol`:
- Cliente: muestra título + descripción + código
- Senior: muestra título + descripción + categoría + prioridad + código + asignados

### 11. Nav para cliente

```
Cliente:    Inicio, Nuevo Ticket, Mis Tickets, Logout
Developer:  Inicio, Tickets, Logout
Senior:     Inicio, Nuevo Ticket, Tickets, Usuarios, Logout
```

### 12. Panel de usuarios: tres roles

El botón cambia según el estado actual:
- Cliente → "Promover a Developer"
- Developer → "Promover a Senior" / "Degradar a Cliente"
- Senior → "Degradar a Developer"

### 13. Migración

- Cambiar default de `rol` de "developer" a "cliente"
- Hacer `categoria` y `prioridad` nullable en tickets
- Agregar columna `motivo_rechazo` nullable en tickets
- Cambiar default de `estado` de "Abierto" a "Pendiente"
- Usuarios existentes mantienen su rol actual

## Risks / Trade-offs

- **[Hard delete de tickets]** → Se pierde el registro. Aceptable porque solo aplica a tickets "Pendiente" que nunca entraron al flujo de trabajo.
- **[Categoría/prioridad nullable]** → Queries de filtrado deben manejar null. Minor.
- **[Tres roles en un campo string]** → Sigue siendo suficiente. Si creciera a más roles, migrar a tabla.
