## Why

El cambio 1 (contrato-api-e-infraestructura) creó endpoints stub. Este cambio reemplaza los stubs con la implementación real: lógica de negocio, acceso a base de datos, autenticación con sesiones, validación de transiciones de estado, y gestión de observaciones técnicas.

## What Changes

- Reemplazar stubs de auth con registro real (hasheo bcrypt), login con sesiones (cookies firmadas) y protección de rutas
- Implementar CRUD real de tickets con SQLModel + PostgreSQL
- Implementar validación de transiciones de estado (Abierto → En revisión → En proceso → Resuelto → Cerrado)
- Implementar resolución obligatoria al marcar como Resuelto
- Implementar observaciones con tipo técnico y bloqueo en tickets cerrados
- Implementar filtrado de tickets por estado, prioridad y categoría vía query params

## Capabilities

### Modified Capabilities

- `user-auth`: Reemplazar stubs con implementación real de registro, login con sesiones, logout y protección de rutas
- `ticket-management`: Reemplazar stubs con CRUD real, validación de estados, resolución obligatoria, observaciones
- `code-review`: Implementar persistencia de fragmentos de código y observaciones técnicas categorizadas
- `ticket-tracking`: Implementar filtrado real por query params y ordenamiento por fecha

## Impact

- **Código modificado:** backend/app/routers/auth.py, tickets.py (reemplazar stubs con lógica real)
- **Código nuevo:** Middleware/dependencia de sesiones, lógica de transición de estados
- **Base de datos:** Escritura/lectura real a PostgreSQL vía SQLModel
