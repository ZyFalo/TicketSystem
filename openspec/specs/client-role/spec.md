# client-role Specification

## Purpose
Define el rol "cliente" como rol por defecto al registrarse, sus permisos limitados (crear tickets sin clasificar, ver solo sus tickets, cancelar tickets pendientes) y sus restricciones (no puede cambiar estados).

## Requirements

### Requirement: Rol cliente
El sistema SHALL soportar un tercer rol "cliente" que es el default al registrarse. El cliente crea tickets sin clasificarlos y solo ve sus propios tickets.

#### Scenario: Registro crea cliente
- **WHEN** un visitante se registra
- **THEN** el usuario se crea con rol "cliente"

#### Scenario: Cliente crea ticket pendiente
- **WHEN** un cliente crea un ticket con titulo, descripcion y codigo opcional
- **THEN** el sistema crea el ticket con estado "Pendiente" sin categoria ni prioridad

#### Scenario: Cliente solo ve sus tickets
- **WHEN** un cliente consulta GET /api/tickets
- **THEN** solo ve tickets donde es el creador

#### Scenario: Cliente cancela ticket pendiente
- **WHEN** un cliente envia DELETE /api/tickets/{id} de un ticket suyo en estado "Pendiente"
- **THEN** el sistema elimina el ticket

#### Scenario: Cliente no puede cancelar ticket clasificado
- **WHEN** un cliente intenta eliminar un ticket que no esta en "Pendiente"
- **THEN** el sistema retorna HTTP 400

#### Scenario: Cliente agrega observacion a su ticket
- **WHEN** un cliente envia observacion a un ticket que creo y no esta cerrado ni rechazado
- **THEN** la observacion se registra

#### Scenario: Cliente no cambia estados
- **WHEN** un cliente intenta cambiar el estado de cualquier ticket
- **THEN** el sistema retorna HTTP 403
