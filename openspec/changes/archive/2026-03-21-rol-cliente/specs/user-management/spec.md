## MODIFIED Requirements

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
