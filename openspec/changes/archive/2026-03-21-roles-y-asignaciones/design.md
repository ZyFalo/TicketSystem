## Context

El sistema tiene autenticación funcional con sesiones (itsdangerous), CRUD de tickets y observaciones. No tiene roles ni asignación múltiple. El campo `asignado_a` en Ticket es un FK simple a un solo usuario. Este cambio introduce roles, permisos diferenciados, asignación M:N con historial y un panel de gestión de usuarios.

## Goals / Non-Goals

**Goals:**

- Dos roles: senior (gestión completa) y developer (resolver tickets asignados)
- Asignación M:N de responsables por ticket con historial de snapshots por fecha
- Validación de permisos por rol en cada endpoint y transición de estado
- Panel de usuarios para promover/degradar (solo seniors)
- Visibilidad de creador y asignados en todo el frontend
- Filtro "Mis tickets" por asignación

**Non-Goals:**

- Roles granulares o permisos configurables
- CRUD de usuarios (crear/eliminar) desde el panel
- Foto de perfil
- Asignación automática de tickets

## Decisions

### 1. Campo `rol` como string en Usuario

```python
class Usuario(UsuarioBase, table=True):
    rol: str = Field(default="developer")  # "senior" | "developer"
```

Alternativa considerada: tabla de roles M:N. Descartada — solo hay 2 roles, un campo string es suficiente.

### 2. Registro siempre crea developer

El endpoint `/api/register` ignora cualquier campo `rol` enviado. Siempre crea con `rol="developer"`. El primer senior se crea con UPDATE directo en BD.

### 3. Dependencia `require_senior`

```python
def require_senior(current_user: Usuario = Depends(get_current_user)) -> Usuario:
    if current_user.rol != "senior":
        raise HTTPException(status_code=403, detail="Se requiere rol senior")
    return current_user
```

Se aplica como `Depends(require_senior)` en endpoints restringidos. Los endpoints que permiten ambos roles siguen usando `Depends(get_current_user)`.

### 4. Permisos por transición de estado

```python
TRANSICIONES_SENIOR = {
    "Abierto": ["En revisión"],
    "Resuelto": ["Cerrado"],
}

TRANSICIONES_DEVELOPER = {
    "En revisión": ["En proceso"],
    "En proceso": ["Resuelto"],
}
```

El endpoint `/estado` consulta el mapa según el rol del usuario. Un developer solo puede cambiar estado de tickets donde está asignado.

### 5. Asignación M:N con dos tablas

```python
class TicketAsignacion(SQLModel, table=True):
    __tablename__ = "ticket_asignaciones"
    ticket_id: int = Field(foreign_key="tickets.id", primary_key=True)
    usuario_id: int = Field(foreign_key="usuarios.id", primary_key=True)
    assigned_at: datetime

class AsignacionHistorial(SQLModel, table=True):
    __tablename__ = "asignacion_historial"
    id: int | None = Field(default=None, primary_key=True)
    ticket_id: int = Field(foreign_key="tickets.id")
    created_at: datetime
    usuario_ids: str  # JSON array de IDs, ej: "[1, 3, 5]"
    usuario_nombres: str  # JSON array de nombres, ej: '["Ana", "Carlos"]'
```

Se elimina `asignado_a` de Ticket. Se agrega relación M:N via `TicketAsignacion`.

El historial guarda un snapshot (JSON string) de los IDs y nombres de los asignados cada vez que cambia la lista. No es una tabla relacional normalizada — es un log inmutable.

### 6. Endpoint de asignación

```
PUT /api/tickets/{id}/asignados
Body: { "usuario_ids": [2, 5, 7] }
```

Reemplaza la lista completa de asignados. Solo seniors pueden llamarlo. Al ejecutarse:
1. Borra los registros actuales de TicketAsignacion para ese ticket
2. Inserta los nuevos
3. Crea entrada en AsignacionHistorial con snapshot

Si la lista queda vacía y el ticket no está en "Abierto", el ticket vuelve a "Abierto".

### 7. Validación: asignados requeridos para salir de "Abierto"

Antes de cambiar de "Abierto" a "En revisión", se verifica que `TicketAsignacion` tenga al menos 1 registro. Si no, HTTP 400.

### 8. TicketRead ampliado

```python
class TicketRead(TicketBase):
    ...
    creador_nombre: str | None = None
    asignados: list[UsuarioRead] = []
```

Los endpoints de tickets llenan `creador_nombre` y `asignados` consultando las tablas relacionadas.

### 9. Filtro "Mis tickets"

```
GET /api/tickets?mis_tickets=true
```

Filtra por tickets donde el usuario actual está en TicketAsignacion. Se combina con los otros filtros existentes (estado, prioridad, categoría) con AND.

### 10. Panel de usuarios

Nueva página `/usuarios` con endpoint `GET /api/usuarios` (solo seniors) y `PATCH /api/usuarios/{id}/rol` para alternar entre senior/developer.

Frontend: tabla con nombre, email, rol actual y botón promover/degradar.

### 11. Migración de datos existentes

La migración Alembic debe:
1. Agregar columna `rol` a `usuarios` con default "developer"
2. Crear tablas `ticket_asignaciones` y `asignacion_historial`
3. Migrar datos de `asignado_a`: por cada ticket con `asignado_a` no null, crear registro en `ticket_asignaciones`
4. Eliminar columna `asignado_a` de `tickets`

## Risks / Trade-offs

- **[Historial como JSON string]** → No es relacional puro. Aceptable porque es un log de lectura — nunca se consulta por "todos los tickets donde developer X estuvo asignado en algún momento". Si se necesitara eso, habría que normalizar.
- **[PUT reemplaza lista completa]** → Si dos seniors asignan simultáneamente, el último gana. Aceptable para proyecto académico con pocos usuarios concurrentes.
- **[Sin degradación del propio rol]** → Un senior podría degradarse a sí mismo y quedarse sin seniors. Se podría validar que siempre exista al menos 1 senior, pero para demo académica no es crítico.
