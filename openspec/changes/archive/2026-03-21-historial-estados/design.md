## Context

Los tickets cambian de estado a lo largo de su ciclo de vida (Pendiente→Abierto→En revisión→En proceso→Resuelto→Cerrado, con posible Rechazado). Actualmente solo se guarda el estado actual. Se necesita un log de cada transición.

## Goals / Non-Goals

**Goals:**

- Tabla de historial con cada cambio de estado registrado
- Endpoint para consultar historial por ticket
- Visible en detalle para todos los roles
- Cliente no ve quién ejecutó el cambio
- Layout 50/50 con historial de asignaciones en CSS puro
- Ordenado DESC por fecha

**Non-Goals:**

- Editar ni eliminar entradas del historial
- Notificaciones al cambiar estado

## Decisions

### 1. Modelo EstadoHistorial

```python
class EstadoHistorial(SQLModel, table=True):
    __tablename__ = "estado_historial"
    id: int | None = Field(default=None, primary_key=True)
    ticket_id: int = Field(foreign_key="tickets.id")
    estado_id: int = Field(foreign_key="estados.id")
    cambiado_por: int = Field(foreign_key="usuarios.id")
    created_at: datetime
```

### 2. Schema de lectura

```python
class EstadoHistorialRead(SQLModel):
    estado: EstadoRead
    cambiado_por_nombre: str | None = None  # null para clientes
    created_at: datetime
```

### 3. Registro automático

Se inserta un registro en dos momentos:
- Al crear ticket: estado "Pendiente", cambiado_por = creador
- Al cambiar estado via endpoint /estado: nuevo estado, cambiado_por = usuario actual

### 4. Endpoint

```
GET /api/tickets/{id}/historial-estados
→ list[EstadoHistorialRead] ordenado por created_at DESC
```

El backend siempre envía `cambiado_por_nombre`. El frontend decide si mostrarlo según el rol.

### 5. Layout CSS 50/50

```css
.historial-container {
    display: flex;
    gap: 1.5rem;
}
.historial-container > div {
    flex: 1;
}
```

Para cliente: el historial de asignaciones se oculta (ya implementado), el de estados ocupa 100%.

## Risks / Trade-offs

- **[Volumen de datos]** → Cada cambio de estado = 1 fila. Para un proyecto académico, insignificante.
- **[Sin historial retroactivo]** → Los tickets que ya cambiaron de estado antes de esta migración no tendrán historial. Solo se registran cambios futuros.
