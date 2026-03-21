## ADDED Requirements

### Requirement: Rol cliente
El sistema SHALL soportar un tercer rol "cliente" que es el default al registrarse. El cliente crea tickets sin clasificarlos y solo ve sus propios tickets.

#### Scenario: Registro crea cliente
- **WHEN** un visitante se registra
- **THEN** el usuario se crea con rol "cliente"

#### Scenario: Cliente crea ticket pendiente
- **WHEN** un cliente crea un ticket con título, descripción y código opcional
- **THEN** el sistema crea el ticket con estado "Pendiente" sin categoría ni prioridad

#### Scenario: Cliente solo ve sus tickets
- **WHEN** un cliente consulta GET /api/tickets
- **THEN** solo ve tickets donde es el creador

#### Scenario: Cliente cancela ticket pendiente
- **WHEN** un cliente envía DELETE /api/tickets/{id} de un ticket suyo en estado "Pendiente"
- **THEN** el sistema elimina el ticket

#### Scenario: Cliente no puede cancelar ticket clasificado
- **WHEN** un cliente intenta eliminar un ticket que no está en "Pendiente"
- **THEN** el sistema retorna HTTP 400

#### Scenario: Cliente agrega observación a su ticket
- **WHEN** un cliente envía observación a un ticket que creó y no está cerrado ni rechazado
- **THEN** la observación se registra

#### Scenario: Cliente no cambia estados
- **WHEN** un cliente intenta cambiar el estado de cualquier ticket
- **THEN** el sistema retorna HTTP 403
