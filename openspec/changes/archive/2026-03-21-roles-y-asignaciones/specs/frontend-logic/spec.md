## MODIFIED Requirements

### Requirement: Wrapper API reutilizable (api.js)
El frontend SHALL usar el rol obtenido de /api/me para condicionar la visibilidad de acciones en todas las páginas.

#### Scenario: Rol disponible para todas las páginas
- **WHEN** cualquier página carga
- **THEN** el JS consulta /api/me y almacena el rol del usuario para condicionar la UI

### Requirement: Lógica de detalle (detalle.js)
El detalle SHALL mostrar controles de asignación (multi-select) solo para seniors, y controles de estado según el rol y si el usuario está asignado.

#### Scenario: Senior ve controles de asignación
- **WHEN** un senior accede al detalle de un ticket
- **THEN** ve el multi-select para asignar responsables y los controles de estado correspondientes a su rol

#### Scenario: Developer ve controles limitados
- **WHEN** un developer asignado accede al detalle
- **THEN** solo ve los controles de estado que su rol permite (En revisión→En proceso, En proceso→Resuelto)

## ADDED Requirements

### Requirement: Lógica de gestión de usuarios (usuarios.js)
El frontend SHALL cargar la lista de usuarios y permitir cambiar roles con un botón por fila.

#### Scenario: Cambiar rol actualiza sin recargar
- **WHEN** un senior pulsa Promover/Degradar en un usuario
- **THEN** el rol se actualiza vía API y la tabla refleja el cambio sin recargar la página
