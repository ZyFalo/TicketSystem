## MODIFIED Requirements

### Requirement: Página de creación de ticket (crear.html)
El formulario SHALL adaptarse al rol: cliente ve título + descripción + código opcional. Senior ve título + descripción + categoría + prioridad + código + asignados.

#### Scenario: Formulario cliente
- **WHEN** un cliente accede a /crear
- **THEN** ve solo título, descripción y código opcional

#### Scenario: Formulario senior
- **WHEN** un senior accede a /crear
- **THEN** ve todos los campos incluyendo categoría, prioridad y asignados

### Requirement: Navegación compartida
La nav SHALL adaptarse a tres roles: cliente ve Inicio + Nuevo Ticket + Mis Tickets + Logout. Developer ve Inicio + Tickets + Logout. Senior ve Inicio + Nuevo Ticket + Tickets + Usuarios + Logout.

#### Scenario: Nav para cliente
- **WHEN** un cliente está autenticado
- **THEN** la nav muestra Inicio, Nuevo Ticket, Mis Tickets, Logout

#### Scenario: Nav para developer
- **WHEN** un developer está autenticado
- **THEN** la nav muestra Inicio, Tickets, Logout

#### Scenario: Nav para senior
- **WHEN** un senior está autenticado
- **THEN** la nav muestra Inicio, Nuevo Ticket, Tickets, Usuarios, Logout

### Requirement: Página de detalle de ticket (detalle.html)
El detalle SHALL mostrar el motivo de rechazo cuando el ticket está en estado "Rechazado". El cliente puede ver un botón "Cancelar" si el ticket está en "Pendiente".

#### Scenario: Motivo de rechazo visible
- **WHEN** un usuario ve un ticket con estado "Rechazado"
- **THEN** el motivo de rechazo se muestra en el detalle

#### Scenario: Botón cancelar para cliente
- **WHEN** un cliente ve su ticket en estado "Pendiente"
- **THEN** ve un botón "Cancelar Ticket" que elimina el ticket
