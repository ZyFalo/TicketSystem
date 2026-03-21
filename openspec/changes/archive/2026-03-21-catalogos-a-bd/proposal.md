## Why

Las categorías, prioridades y estados están hardcodeados como listas Python en el código. Esto impide consultar opciones válidas desde la base de datos y genera inconsistencia — los tickets guardan strings libres sin validación referencial. Migrar a tablas con FK normaliza los datos y permite que el frontend consulte opciones desde la BD en vez de listas quemadas.

## What Changes

- Crear tabla `categorias` (id, nombre) con seed de datos actuales
- Crear tabla `prioridades` (id, nombre, orden) con seed de datos actuales
- Crear tabla `estados` (id, nombre, color) con seed de los 7 estados actuales
- Migrar campo `categoria` (string) → `categoria_id` (FK) en tickets
- Migrar campo `prioridad` (string) → `prioridad_id` (FK) en tickets
- Migrar campo `estado` (string) → `estado_id` (FK) en tickets
- Adaptar modelos SQLModel: TicketBase, TicketCreate, TicketRead, TicketUpdate
- Adaptar endpoint `/api/tickets/opciones` para consultar tablas en vez de listas
- Adaptar todos los endpoints de tickets para trabajar con IDs
- Adaptar frontend: selects cargan IDs, envían IDs, muestran nombres
- Las transiciones de estado siguen hardcodeadas en código (referenciando por nombre/ID)
- Sin CRUD — las tablas son catálogos fijos con seed, no editables desde el panel

## Capabilities

### New Capabilities

- `catalog-tables`: Tablas de catálogo (categorias, prioridades, estados) como fuente de verdad para opciones de tickets

### Modified Capabilities

- `ticket-management`: Campos categoria/prioridad/estado pasan de string a FK con validación referencial
- `ticket-tracking`: Filtros y listado trabajan con IDs, resuelven nombres via join
- `api-contract`: Endpoint /opciones consulta tablas, TicketRead devuelve objetos con id+nombre
- `frontend-logic`: Selects cargan y envían IDs en vez de strings
- `infrastructure`: Migración Alembic con seed de datos y transformación de columnas

## Impact

- **Modelo:** 3 tablas nuevas, 3 campos FK en Ticket reemplazan 3 strings
- **Migración:** Crear tablas, seed, migrar datos existentes de string a FK, eliminar columnas string
- **API:** Todos los endpoints de tickets adaptan entrada/salida a IDs
- **Frontend:** Selects manejan value=ID, muestran nombre, envían ID al API
