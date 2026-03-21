## ADDED Requirements

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
El sistema SHALL manejar un flujo de estados para cada ticket: Abierto → En revisión → En proceso → Resuelto → Cerrado.

#### Scenario: Transición de estado válida
- **WHEN** un usuario cambia el estado de un ticket siguiendo el flujo definido (ej. de "Abierto" a "En revisión")
- **THEN** el sistema actualiza el estado y registra la fecha de cambio

#### Scenario: Transición de estado inválida
- **WHEN** un usuario intenta cambiar el estado saltando pasos del flujo (ej. de "Abierto" a "Resuelto")
- **THEN** el sistema rechaza la transición e indica los estados válidos desde el estado actual

### Requirement: Registrar resolución del ticket
El sistema SHALL permitir registrar la resolución final de un ticket al marcarlo como "Resuelto".

#### Scenario: Resolución exitosa
- **WHEN** un usuario cambia el estado a "Resuelto" e incluye texto de resolución
- **THEN** el sistema almacena la resolución y actualiza el estado

#### Scenario: Resolución sin texto
- **WHEN** un usuario intenta marcar como "Resuelto" sin incluir texto de resolución
- **THEN** el sistema rechaza el cambio e indica que la resolución es obligatoria

### Requirement: Agregar observaciones al ticket
El sistema SHALL permitir agregar observaciones a un ticket durante su ciclo de vida.

#### Scenario: Observación agregada
- **WHEN** un usuario autenticado agrega una observación a un ticket que no está cerrado
- **THEN** el sistema registra la observación con autor y fecha

#### Scenario: Observación en ticket cerrado
- **WHEN** un usuario intenta agregar una observación a un ticket con estado "Cerrado"
- **THEN** el sistema rechaza la operación

### Requirement: Campos del ticket
Cada ticket SHALL almacenar: ID único, título, descripción, categoría, prioridad, estado, fecha de creación, fecha de actualización, observaciones, resolución, fragmento de código (opcional), lenguaje del código (opcional), usuario creador y usuario asignado.

#### Scenario: Persistencia completa
- **WHEN** se crea un ticket con todos los campos
- **THEN** todos los campos quedan almacenados en la base de datos y son recuperables vía API
