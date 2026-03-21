# ticket-management Specification

## Purpose
TBD - created by archiving change sistema-tickets-soporte. Update Purpose after archive.
## Requirements
### Requirement: Crear ticket de soporte
El endpoint POST /api/tickets SHALL recibir categoria_id y prioridad_id (int opcionales) en vez de strings.

#### Scenario: Cliente crea ticket sin clasificar
- **WHEN** un cliente envía POST /api/tickets sin categoria_id ni prioridad_id
- **THEN** el ticket se crea con estado_id correspondiente a "Pendiente"

#### Scenario: Senior crea ticket clasificado
- **WHEN** un senior envía POST /api/tickets con categoria_id y prioridad_id
- **THEN** el ticket se crea con las FK correspondientes

#### Scenario: Developer intenta crear
- **WHEN** un developer envía POST /api/tickets
- **THEN** el sistema retorna HTTP 403

#### Scenario: Historial inicial al crear
- **WHEN** un usuario crea un ticket
- **THEN** se crea una entrada en estado_historial con estado Pendiente y cambiado_por del creador

### Requirement: Consultar ticket individual
El sistema SHALL permitir consultar la información completa de un ticket por su ID, incluyendo observaciones y resolución.

#### Scenario: Consulta exitosa
- **WHEN** el usuario solicita ver un ticket existente por su ID
- **THEN** el sistema muestra todos los campos del ticket, sus observaciones y su resolución (si existe)

#### Scenario: Ticket no encontrado
- **WHEN** el usuario solicita un ticket con un ID inexistente
- **THEN** el sistema responde con error 404

### Requirement: Actualizar ticket
El sistema SHALL permitir solo a usuarios con rol "senior" actualizar campos editables. El campo creado_por no es modificable.

#### Scenario: Senior edita ticket
- **WHEN** un senior envía PATCH /api/tickets/{id}
- **THEN** el sistema actualiza los campos enviados (excepto creado_por)

#### Scenario: Developer intenta editar
- **WHEN** un developer envía PATCH /api/tickets/{id}
- **THEN** el sistema retorna HTTP 403

### Requirement: Sistema de estados del ticket
El sistema SHALL manejar 7 estados: Pendiente, Abierto, En revisión, En proceso, Resuelto, Cerrado, Rechazado. Pendiente→Abierto requiere categoría, prioridad y al menos 1 asignado. Pendiente→Rechazado requiere motivo obligatorio.

#### Scenario: Senior clasifica ticket pendiente
- **WHEN** un senior cambia un ticket de "Pendiente" a "Abierto" con categoría, prioridad y asignados configurados
- **THEN** el sistema valida que los tres están presentes y actualiza el estado

#### Scenario: Clasificar sin categoría
- **WHEN** un senior intenta cambiar a "Abierto" sin haber asignado categoría
- **THEN** el sistema retorna HTTP 400 indicando que se requiere categoría

#### Scenario: Senior rechaza ticket
- **WHEN** un senior cambia un ticket de "Pendiente" a "Rechazado" con motivo_rechazo
- **THEN** el sistema almacena el motivo y cambia el estado

#### Scenario: Rechazar sin motivo
- **WHEN** un senior intenta rechazar sin motivo_rechazo
- **THEN** el sistema retorna HTTP 422

#### Scenario: Transición de estado válida
- **WHEN** un usuario cambia el estado de un ticket siguiendo el mapa de transiciones
- **THEN** el sistema actualiza el estado, registra updated_at y retorna el ticket actualizado

#### Scenario: Transición de estado inválida
- **WHEN** un usuario intenta una transición no permitida por el mapa
- **THEN** el sistema retorna HTTP 400 con el estado actual y la lista de estados válidos desde ese estado

#### Scenario: Historial al cambiar estado
- **WHEN** se cambia el estado de un ticket via /estado
- **THEN** se inserta un registro en estado_historial con el nuevo estado y el usuario que ejecutó el cambio

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

### Requirement: Cancelar ticket
El sistema SHALL permitir al cliente creador eliminar su ticket solo si está en estado "Pendiente".

#### Scenario: Cliente cancela ticket pendiente
- **WHEN** un cliente envía DELETE /api/tickets/{id} de un ticket suyo en estado "Pendiente"
- **THEN** el sistema elimina el ticket de la base de datos

#### Scenario: Cliente intenta cancelar ticket clasificado
- **WHEN** un cliente intenta eliminar un ticket que no está en "Pendiente"
- **THEN** el sistema retorna HTTP 400

#### Scenario: Otro usuario intenta cancelar
- **WHEN** un usuario intenta eliminar un ticket que no creó
- **THEN** el sistema retorna HTTP 403

### Requirement: Campos del ticket
Cada ticket SHALL referenciar categoría, prioridad y estado mediante FK a tablas de catálogo en vez de strings libres.

#### Scenario: Ticket con FK a catálogos
- **WHEN** se crea un ticket con categoria_id, prioridad_id
- **THEN** el sistema valida que los IDs existen en las tablas correspondientes

#### Scenario: Estado por FK
- **WHEN** se cambia el estado de un ticket
- **THEN** el sistema resuelve el estado_id desde la tabla estados por nombre

