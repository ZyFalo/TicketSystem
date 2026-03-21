# user-roles Specification

## Purpose
Define los roles de usuario del sistema y los permisos diferenciados por rol en las operaciones y transiciones de estado de tickets.

## Requirements

### Requirement: Roles de usuario
El sistema SHALL soportar tres roles: "cliente", "developer" y "senior". Cada usuario tiene exactamente un rol. El default al registrarse es "cliente".

#### Scenario: Registro crea cliente
- **WHEN** un visitante se registra
- **THEN** el usuario se crea con rol "cliente"

### Requirement: Permisos por transición de estado
El sistema SHALL aplicar permisos diferenciados por rol. Cliente no puede cambiar estados. Senior: Pendiente→[Abierto, Rechazado], Resuelto→Cerrado. Developer asignado: Abierto→En revisión→En proceso→Resuelto.

#### Scenario: Cliente intenta cambiar estado
- **WHEN** un cliente intenta cambiar el estado de un ticket
- **THEN** el sistema retorna HTTP 403

#### Scenario: Senior cambia Abierto a En revisión
- **WHEN** un senior cambia un ticket de "Abierto" a "En revisión"
- **THEN** el sistema permite la transición

#### Scenario: Senior cierra ticket resuelto
- **WHEN** un senior cambia un ticket de "Resuelto" a "Cerrado"
- **THEN** el sistema permite la transición

#### Scenario: Developer avanza ticket asignado
- **WHEN** un developer asignado al ticket cambia de "En revisión" a "En proceso" o de "En proceso" a "Resuelto"
- **THEN** el sistema permite la transición

#### Scenario: Developer no asignado denegado
- **WHEN** un developer intenta cambiar estado de un ticket al que no está asignado
- **THEN** el sistema retorna HTTP 403

#### Scenario: Developer intenta cerrar
- **WHEN** un developer intenta cambiar un ticket a "Cerrado"
- **THEN** el sistema retorna HTTP 403
