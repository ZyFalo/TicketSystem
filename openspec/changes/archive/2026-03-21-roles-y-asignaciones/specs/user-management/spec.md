## ADDED Requirements

### Requirement: Panel de gestión de usuarios
El sistema SHALL proveer una página /usuarios accesible solo por seniors que muestre la lista de usuarios con su rol.

#### Scenario: Senior accede al panel
- **WHEN** un senior accede a /usuarios
- **THEN** ve una tabla con ID, nombre, email, rol y acción por cada usuario

#### Scenario: Developer denegado
- **WHEN** un developer intenta acceder a /usuarios
- **THEN** el sistema redirige o muestra error de permisos

### Requirement: Promover y degradar usuarios
Un senior SHALL poder cambiar el rol de cualquier usuario entre "senior" y "developer" desde el panel.

#### Scenario: Promover developer a senior
- **WHEN** un senior pulsa "Promover" en un usuario con rol developer
- **THEN** el usuario cambia a rol senior

#### Scenario: Degradar senior a developer
- **WHEN** un senior pulsa "Degradar" en un usuario con rol senior
- **THEN** el usuario cambia a rol developer
