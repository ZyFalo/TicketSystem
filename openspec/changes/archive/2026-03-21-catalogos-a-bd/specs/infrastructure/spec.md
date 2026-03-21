## MODIFIED Requirements

### Requirement: Migración Alembic
La migración SHALL crear tablas de catálogo, insertar seed, migrar datos existentes de string a FK y eliminar columnas string.

#### Scenario: Migración completa
- **WHEN** se ejecuta alembic upgrade head
- **THEN** existen tablas categorias/prioridades/estados con datos, tickets tienen FK, columnas string eliminadas
