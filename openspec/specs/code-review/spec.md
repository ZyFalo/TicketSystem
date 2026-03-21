# code-review Specification

## Purpose
TBD - created by archiving change sistema-tickets-soporte. Update Purpose after archive.
## Requirements
### Requirement: Ticket con fragmento de código
El sistema SHALL permitir crear tickets donde el contenido principal sea un fragmento de código que requiere revisión técnica.

#### Scenario: Ticket de revisión de código
- **WHEN** un usuario crea un ticket e incluye un fragmento de código y selecciona un lenguaje
- **THEN** el sistema almacena el código y lo marca como ticket de revisión de código

#### Scenario: Visualización con syntax highlighting
- **WHEN** un usuario consulta un ticket que contiene un fragmento de código
- **THEN** el sistema muestra el código con syntax highlighting usando highlight.js según el lenguaje indicado

#### Scenario: Código sin lenguaje especificado
- **WHEN** un ticket tiene fragmento de código pero no se seleccionó lenguaje
- **THEN** highlight.js aplica autodetección de lenguaje

### Requirement: Observaciones técnicas sobre código
El sistema SHALL persistir observaciones con campo tipo_observacion que acepta los valores: "error_logico", "sintaxis", "variables", "validacion", "organizacion", "buenas_practicas". El campo es opcional (null para observaciones generales no técnicas).

#### Scenario: Agregar observación técnica categorizada
- **WHEN** un revisor envía observación con tipo_observacion="sintaxis" a un ticket con código
- **THEN** la observación se persiste con el tipo y es filtrable al consultar GET /api/tickets/{id}/observaciones

#### Scenario: Observación sin tipo (general)
- **WHEN** un usuario envía observación sin tipo_observacion
- **THEN** la observación se persiste con tipo_observacion=null

### Requirement: Aspectos revisables del código
El módulo de revisión SHALL cubrir los siguientes aspectos: errores de estructura lógica, problemas de sintaxis, uso inadecuado de variables, validaciones incompletas, organización deficiente y falta de buenas prácticas.

#### Scenario: Categorización de observación
- **WHEN** un revisor agrega una observación técnica
- **THEN** puede clasificarla por tipo (error lógico, sintaxis, variables, validación, organización, buenas prácticas)

