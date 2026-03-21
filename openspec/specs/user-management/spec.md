# user-management Specification

## Purpose
Define el panel de gestión de usuarios accesible por seniors para visualizar y modificar los roles de los usuarios del sistema.

## Requirements

### Requirement: Panel de gestión de usuarios
El sistema SHALL proveer una página /usuarios accesible solo por seniors que muestre la lista de usuarios con su rol.

#### Scenario: Senior accede al panel
- **WHEN** un senior accede a /usuarios
- **THEN** ve una tabla con ID, nombre, email, rol y acción por cada usuario

#### Scenario: Developer denegado
- **WHEN** un developer intenta acceder a /usuarios
- **THEN** el sistema redirige o muestra error de permisos

### Requirement: Promover y degradar usuarios
Un senior SHALL poder cambiar el rol de cualquier usuario entre los tres roles disponibles: cliente, developer y senior.

#### Scenario: Promover cliente a developer
- **WHEN** un senior cambia el rol de un cliente
- **THEN** el usuario pasa a rol "developer"

#### Scenario: Promover developer a senior
- **WHEN** un senior cambia el rol de un developer
- **THEN** el usuario pasa a rol "senior"

#### Scenario: Degradar senior a developer
- **WHEN** un senior cambia el rol de un senior
- **THEN** el usuario pasa a rol "developer"

#### Scenario: Degradar developer a cliente
- **WHEN** un senior degrada un developer
- **THEN** el usuario pasa a rol "cliente"
