## MODIFIED Requirements

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
