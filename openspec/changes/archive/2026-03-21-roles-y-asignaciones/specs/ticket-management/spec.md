## MODIFIED Requirements

### Requirement: Crear ticket de soporte
El sistema SHALL permitir solo a usuarios con rol "senior" crear tickets. El creador se registra automáticamente y no es editable.

#### Scenario: Senior crea ticket
- **WHEN** un senior envía POST /api/tickets
- **THEN** el sistema crea el ticket con creado_por del usuario de sesión

#### Scenario: Developer intenta crear
- **WHEN** un developer envía POST /api/tickets
- **THEN** el sistema retorna HTTP 403

### Requirement: Actualizar ticket
El sistema SHALL permitir solo a usuarios con rol "senior" actualizar campos editables. El campo creado_por no es modificable.

#### Scenario: Senior edita ticket
- **WHEN** un senior envía PATCH /api/tickets/{id}
- **THEN** el sistema actualiza los campos enviados (excepto creado_por)

#### Scenario: Developer intenta editar
- **WHEN** un developer envía PATCH /api/tickets/{id}
- **THEN** el sistema retorna HTTP 403
