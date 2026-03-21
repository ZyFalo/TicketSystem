## MODIFIED Requirements

### Requirement: Registro de usuario
El sistema SHALL permitir crear cuentas de usuario con nombre, email y contraseña. El rol asignado siempre es "cliente".

#### Scenario: Registro exitoso
- **WHEN** un visitante envía nombre, email único y contraseña válida
- **THEN** el sistema crea la cuenta con rol "cliente" y contraseña hasheada
