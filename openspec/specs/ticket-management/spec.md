# ticket-management Specification

## Purpose
TBD - created by archiving change sistema-tickets-soporte. Update Purpose after archive.
## Requirements
### Requirement: Crear ticket de soporte
El sistema SHALL permitir a un usuario autenticado crear un ticket de soporte con los campos: título, descripción, categoría, prioridad y fragmento de código (opcional).

#### Scenario: Creación exitosa de ticket
- **WHEN** el usuario envía el formulario con título, descripción, categoría y prioridad válidos
- **THEN** el sistema crea el ticket con estado "Abierto", asigna un ID único y registra la fecha de creación

#### Scenario: Creación de ticket con fragmento de código
- **WHEN** el usuario incluye un fragmento de código al crear el ticket
- **THEN** el sistema almacena el fragmento asociado al ticket y permite seleccionar el lenguaje de programación

#### Scenario: Campos obligatorios faltantes
- **WHEN** el usuario envía el formulario sin título o sin descripción
- **THEN** el sistema rechaza la solicitud e indica los campos faltantes

### Requirement: Consultar ticket individual
El sistema SHALL permitir consultar la información completa de un ticket por su ID, incluyendo observaciones y resolución.

#### Scenario: Consulta exitosa
- **WHEN** el usuario solicita ver un ticket existente por su ID
- **THEN** el sistema muestra todos los campos del ticket, sus observaciones y su resolución (si existe)

#### Scenario: Ticket no encontrado
- **WHEN** el usuario solicita un ticket con un ID inexistente
- **THEN** el sistema responde con error 404

### Requirement: Actualizar ticket
El sistema SHALL permitir actualizar la información de un ticket durante su atención (descripción, categoría, prioridad, asignación).

#### Scenario: Actualización exitosa
- **WHEN** un usuario autenticado modifica campos editables de un ticket existente
- **THEN** el sistema actualiza los campos y registra la fecha de última modificación

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

### Requirement: Campos del ticket
Cada ticket SHALL almacenar: ID único, título, descripción, categoría, prioridad, estado, fecha de creación, fecha de actualización, observaciones, resolución, fragmento de código (opcional), lenguaje del código (opcional), usuario creador y usuario asignado.

#### Scenario: Persistencia completa
- **WHEN** se crea un ticket con todos los campos
- **THEN** todos los campos quedan almacenados en la base de datos y son recuperables vía API

