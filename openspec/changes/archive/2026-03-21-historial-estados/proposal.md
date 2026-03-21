## Why

Cuando un ticket cambia de estado, el estado anterior se pierde — solo se guarda el estado actual. No hay forma de saber cuándo pasó por cada etapa ni quién ejecutó cada cambio. Se necesita un log inmutable de cambios de estado para trazabilidad.

## What Changes

- Crear tabla `estado_historial` (ticket_id, estado_id, cambiado_por, created_at)
- Registrar entrada al crear ticket (estado inicial "Pendiente")
- Registrar entrada en cada cambio de estado
- Endpoint GET /api/tickets/{id}/historial-estados para consultar
- Mostrar en detalle del ticket junto al historial de asignaciones (50% / 50%)
- Cliente ve historial de estados sin nombres de quién ejecutó la acción
- Developer y senior ven con nombres
- Lista ordenada DESC por fecha (más reciente primero)

## Capabilities

### New Capabilities

- `state-history`: Historial de cambios de estado por ticket con trazabilidad de quién ejecutó cada cambio

### Modified Capabilities

- `ticket-management`: Registrar entrada en historial al crear ticket y al cambiar estado
- `frontend-pages`: Detalle muestra historial de estados y asignaciones lado a lado (50%/50%)
- `frontend-logic`: Cargar y renderizar historial de estados, condicionar nombres por rol

## Impact

- **Modelo:** 1 tabla nueva (estado_historial)
- **API:** 1 endpoint nuevo (GET /api/tickets/{id}/historial-estados)
- **Backend:** Insertar registro en cada cambio de estado y al crear ticket
- **Frontend:** Sección nueva en detalle, layout 50/50 con CSS
