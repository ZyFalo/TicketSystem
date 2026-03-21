## ADDED Requirements

### Requirement: Roles de usuario
El sistema SHALL soportar dos roles: "senior" y "developer". Cada usuario tiene exactamente un rol.

#### Scenario: Registro crea developer
- **WHEN** un visitante se registra
- **THEN** el usuario se crea con rol "developer" independientemente de cualquier campo enviado

#### Scenario: Senior accede a funciones restringidas
- **WHEN** un usuario con rol "senior" intenta crear un ticket
- **THEN** el sistema permite la operación

#### Scenario: Developer denegado en funciones de senior
- **WHEN** un usuario con rol "developer" intenta crear un ticket
- **THEN** el sistema retorna HTTP 403

### Requirement: Permisos por transición de estado
El sistema SHALL aplicar permisos diferenciados por rol en las transiciones de estado.

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
