## ADDED Requirements

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
El sistema SHALL permitir registrar observaciones técnicas específicas sobre el fragmento de código de un ticket.

#### Scenario: Agregar observación técnica
- **WHEN** un revisor agrega una observación a un ticket con código
- **THEN** la observación queda asociada al ticket y visible junto al fragmento de código

### Requirement: Aspectos revisables del código
El módulo de revisión SHALL cubrir los siguientes aspectos: errores de estructura lógica, problemas de sintaxis, uso inadecuado de variables, validaciones incompletas, organización deficiente y falta de buenas prácticas.

#### Scenario: Categorización de observación
- **WHEN** un revisor agrega una observación técnica
- **THEN** puede clasificarla por tipo (error lógico, sintaxis, variables, validación, organización, buenas prácticas)
