## MODIFIED Requirements

### Requirement: Sistema de estados del ticket
El sistema SHALL manejar un flujo de estados con validación mediante mapa explícito de transiciones: Abierto→[En revisión], En revisión→[En proceso], En proceso→[Resuelto], Resuelto→[Cerrado], Cerrado→[]. Cualquier transición fuera del mapa SHALL ser rechazada con HTTP 400.

#### Scenario: Transición de estado válida
- **WHEN** un usuario cambia el estado de un ticket siguiendo el mapa de transiciones
- **THEN** el sistema actualiza el estado, registra updated_at y retorna el ticket actualizado

#### Scenario: Transición de estado inválida
- **WHEN** un usuario intenta una transición no permitida por el mapa
- **THEN** el sistema retorna HTTP 400 con el estado actual y la lista de estados válidos desde ese estado

### Requirement: Registrar resolución del ticket
El sistema SHALL requerir texto de resolución al cambiar a estado "Resuelto". El endpoint PATCH /api/tickets/{id}/resolver SHALL recibir {resolucion: string} y cambiar el estado automáticamente.

#### Scenario: Resolución exitosa
- **WHEN** un usuario envía texto de resolución al endpoint /resolver
- **THEN** el sistema almacena la resolución, cambia estado a "Resuelto" y registra updated_at

#### Scenario: Resolución sin texto
- **WHEN** un usuario envía body vacío o sin campo resolucion al endpoint /resolver
- **THEN** el sistema retorna HTTP 422 indicando que resolucion es obligatorio

### Requirement: Agregar observaciones al ticket
El sistema SHALL permitir agregar observaciones con contenido y tipo_observacion opcionales. SHALL rechazar con HTTP 400 observaciones en tickets con estado "Cerrado".

#### Scenario: Observación agregada
- **WHEN** un usuario autenticado envía POST /api/tickets/{id}/observaciones con contenido
- **THEN** el sistema registra la observación con autor_id del usuario de sesión, tipo_observacion y created_at

#### Scenario: Observación en ticket cerrado
- **WHEN** un usuario envía observación a un ticket con estado "Cerrado"
- **THEN** el sistema retorna HTTP 400 con mensaje "No se pueden agregar observaciones a tickets cerrados"
