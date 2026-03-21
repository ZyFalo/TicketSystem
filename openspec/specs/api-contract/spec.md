# api-contract Specification

## Purpose
Define el contrato REST API del sistema de tickets: endpoints, schemas de request/response y documentación Swagger UI.

## Requirements

### Requirement: Endpoints de autenticación documentados
El contrato API SHALL definir los endpoints POST /api/register, POST /api/login, POST /api/logout y GET /api/me con sus schemas de request y response.

#### Scenario: Swagger muestra endpoints de auth
- **WHEN** un desarrollador accede a /docs
- **THEN** los 4 endpoints de auth aparecen documentados con schemas de body y response

### Requirement: Endpoints de tickets documentados
El contrato API SHALL definir GET /api/tickets (con query params estado, prioridad, categoria), POST /api/tickets, GET /api/tickets/{id}, PATCH /api/tickets/{id} y PATCH /api/tickets/{id}/estado con sus schemas.

#### Scenario: Swagger muestra endpoints de tickets
- **WHEN** un desarrollador accede a /docs
- **THEN** los endpoints de tickets aparecen con schemas completos incluyendo query params de filtrado

### Requirement: Endpoint de observaciones documentado
El contrato API SHALL definir POST /api/tickets/{id}/observaciones y GET /api/tickets/{id}/observaciones con schemas que incluyan tipo de observación técnica.

#### Scenario: Swagger muestra endpoint de observaciones
- **WHEN** un desarrollador accede a /docs
- **THEN** el endpoint de observaciones aparece con su schema incluyendo tipo_observacion

### Requirement: Endpoint de resolución documentado
El contrato API SHALL definir PATCH /api/tickets/{id}/resolver con schema que requiera texto de resolución.

#### Scenario: Swagger muestra endpoint de resolución
- **WHEN** un desarrollador accede a /docs
- **THEN** el endpoint de resolución aparece con body obligatorio de texto

### Requirement: Endpoint de opciones
El endpoint GET /api/tickets/opciones SHALL retornar objetos {id, nombre} para categorías, prioridades y estados, consultando las tablas de BD.

#### Scenario: Opciones con IDs
- **WHEN** un usuario consulta GET /api/tickets/opciones
- **THEN** retorna {estados: [{id, nombre, color}], categorias: [{id, nombre}], prioridades: [{id, nombre, orden}]}

### Requirement: Stubs funcionales
Todos los endpoints SHALL retornar datos mock válidos según sus schemas de response para que Swagger UI sea interactivo.

#### Scenario: Endpoint stub responde correctamente
- **WHEN** se ejecuta cualquier endpoint desde Swagger UI
- **THEN** retorna una respuesta con el status code correcto y datos mock que cumplen el schema
