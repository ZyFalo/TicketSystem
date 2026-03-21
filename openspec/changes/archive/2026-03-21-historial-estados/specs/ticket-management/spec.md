## MODIFIED Requirements

### Requirement: Crear ticket de soporte
Al crear un ticket SHALL registrarse automáticamente la primera entrada en el historial de estados con estado "Pendiente".

#### Scenario: Historial inicial al crear
- **WHEN** un usuario crea un ticket
- **THEN** se crea una entrada en estado_historial con estado Pendiente y cambiado_por del creador

### Requirement: Sistema de estados del ticket
Cada cambio de estado SHALL registrar una entrada en el historial de estados.

#### Scenario: Historial al cambiar estado
- **WHEN** se cambia el estado de un ticket via /estado
- **THEN** se inserta un registro en estado_historial con el nuevo estado y el usuario que ejecutó el cambio
