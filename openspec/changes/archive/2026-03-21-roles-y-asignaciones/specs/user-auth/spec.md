## MODIFIED Requirements

### Requirement: Consultar usuario actual
El sistema SHALL exponer un endpoint /api/me que retorne los datos del usuario autenticado incluyendo su rol.

#### Scenario: Usuario autenticado
- **WHEN** un usuario con sesión activa consulta /api/me
- **THEN** el sistema responde con id, nombre, email y rol (sin contraseña)
