## MODIFIED Requirements

### Requirement: Observaciones técnicas sobre código
El sistema SHALL persistir observaciones con campo tipo_observacion que acepta los valores: "error_logico", "sintaxis", "variables", "validacion", "organizacion", "buenas_practicas". El campo es opcional (null para observaciones generales no técnicas).

#### Scenario: Agregar observación técnica categorizada
- **WHEN** un revisor envía observación con tipo_observacion="sintaxis" a un ticket con código
- **THEN** la observación se persiste con el tipo y es filtrable al consultar GET /api/tickets/{id}/observaciones

#### Scenario: Observación sin tipo (general)
- **WHEN** un usuario envía observación sin tipo_observacion
- **THEN** la observación se persiste con tipo_observacion=null
