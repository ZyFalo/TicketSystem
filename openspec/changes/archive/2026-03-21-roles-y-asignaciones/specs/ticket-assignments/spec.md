## ADDED Requirements

### Requirement: Asignación múltiple de responsables
El sistema SHALL permitir asignar múltiples usuarios como responsables de un ticket mediante relación M:N.

#### Scenario: Asignar múltiples developers
- **WHEN** un senior asigna developers [A, B, C] a un ticket
- **THEN** los tres quedan como responsables activos del ticket

#### Scenario: Senior se asigna a sí mismo
- **WHEN** un senior se incluye en la lista de asignados
- **THEN** queda como responsable del ticket junto con los demás

#### Scenario: Reemplazar lista de asignados
- **WHEN** un senior envía PUT /api/tickets/{id}/asignados con nueva lista
- **THEN** la lista anterior se reemplaza completamente por la nueva

#### Scenario: Remover todos los asignados
- **WHEN** un senior envía lista vacía de asignados y el ticket no está en "Abierto"
- **THEN** el ticket vuelve al estado "Abierto" automáticamente

### Requirement: Asignados requeridos para avanzar
El sistema SHALL requerir al menos un responsable asignado para que un ticket salga del estado "Abierto".

#### Scenario: Transición sin asignados
- **WHEN** un senior intenta cambiar un ticket de "Abierto" a "En revisión" sin asignados
- **THEN** el sistema retorna HTTP 400 indicando que se requiere al menos un responsable

### Requirement: Historial de asignaciones
El sistema SHALL registrar un snapshot de los responsables asignados cada vez que la lista cambie, con la fecha del cambio.

#### Scenario: Snapshot al cambiar asignados
- **WHEN** un senior modifica la lista de asignados de un ticket
- **THEN** se crea un registro en el historial con la fecha y los nombres de los asignados resultantes

#### Scenario: Historial visible en detalle
- **WHEN** un usuario consulta el detalle de un ticket
- **THEN** puede ver el historial de asignaciones agrupado por fecha
