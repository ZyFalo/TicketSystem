## ADDED Requirements

### Requirement: Historial de cambios de estado
El sistema SHALL registrar cada cambio de estado de un ticket con el estado destino, quién lo ejecutó y la fecha.

#### Scenario: Registro al crear ticket
- **WHEN** se crea un ticket
- **THEN** se registra una entrada con estado "Pendiente" y el usuario creador

#### Scenario: Registro al cambiar estado
- **WHEN** se cambia el estado de un ticket
- **THEN** se registra una entrada con el nuevo estado y el usuario que ejecutó el cambio

#### Scenario: Consultar historial
- **WHEN** un usuario consulta GET /api/tickets/{id}/historial-estados
- **THEN** retorna la lista de cambios ordenada por fecha DESC

#### Scenario: Cliente ve sin nombres
- **WHEN** un cliente consulta el historial de estados de su ticket
- **THEN** ve las fechas y estados pero no los nombres de quién ejecutó cada cambio

#### Scenario: Senior/developer ve con nombres
- **WHEN** un senior o developer consulta el historial
- **THEN** ve las fechas, estados y el nombre de quién ejecutó cada cambio
