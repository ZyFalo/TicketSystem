## MODIFIED Requirements

### Requirement: Crear ticket de soporte
El sistema SHALL permitir a clientes y seniors crear tickets. Cliente crea con título, descripción y código opcional (sin categoría ni prioridad). Senior crea con todos los campos. El estado inicial es "Pendiente".

#### Scenario: Cliente crea ticket
- **WHEN** un cliente envía POST /api/tickets con título y descripción
- **THEN** el sistema crea el ticket con estado "Pendiente", sin categoría ni prioridad

#### Scenario: Senior crea ticket
- **WHEN** un senior envía POST /api/tickets con todos los campos
- **THEN** el sistema crea el ticket con estado "Pendiente" incluyendo categoría y prioridad

#### Scenario: Developer intenta crear
- **WHEN** un developer envía POST /api/tickets
- **THEN** el sistema retorna HTTP 403

### Requirement: Sistema de estados del ticket
El sistema SHALL manejar 7 estados: Pendiente, Abierto, En revisión, En proceso, Resuelto, Cerrado, Rechazado. Pendiente→Abierto requiere categoría, prioridad y al menos 1 asignado. Pendiente→Rechazado requiere motivo obligatorio.

#### Scenario: Senior clasifica ticket pendiente
- **WHEN** un senior cambia un ticket de "Pendiente" a "Abierto" con categoría, prioridad y asignados configurados
- **THEN** el sistema valida que los tres están presentes y actualiza el estado

#### Scenario: Clasificar sin categoría
- **WHEN** un senior intenta cambiar a "Abierto" sin haber asignado categoría
- **THEN** el sistema retorna HTTP 400 indicando que se requiere categoría

#### Scenario: Senior rechaza ticket
- **WHEN** un senior cambia un ticket de "Pendiente" a "Rechazado" con motivo_rechazo
- **THEN** el sistema almacena el motivo y cambia el estado

#### Scenario: Rechazar sin motivo
- **WHEN** un senior intenta rechazar sin motivo_rechazo
- **THEN** el sistema retorna HTTP 422

### Requirement: Cancelar ticket
El sistema SHALL permitir al cliente creador eliminar su ticket solo si está en estado "Pendiente".

#### Scenario: Cliente cancela ticket pendiente
- **WHEN** un cliente envía DELETE /api/tickets/{id} de un ticket suyo en estado "Pendiente"
- **THEN** el sistema elimina el ticket de la base de datos

#### Scenario: Cliente intenta cancelar ticket clasificado
- **WHEN** un cliente intenta eliminar un ticket que no está en "Pendiente"
- **THEN** el sistema retorna HTTP 400

#### Scenario: Otro usuario intenta cancelar
- **WHEN** un usuario intenta eliminar un ticket que no creó
- **THEN** el sistema retorna HTTP 403
