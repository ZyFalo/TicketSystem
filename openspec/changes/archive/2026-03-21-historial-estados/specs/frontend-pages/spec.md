## MODIFIED Requirements

### Requirement: Página de detalle de ticket (detalle.html)
El detalle SHALL mostrar el historial de estados y el historial de asignaciones lado a lado (50%/50%) usando CSS puro. Para clientes, el historial de estados ocupa 100% (asignaciones ocultas).

#### Scenario: Layout 50/50 para senior/developer
- **WHEN** un senior o developer ve el detalle de un ticket
- **THEN** ve historial de estados a la izquierda (50%) e historial de asignaciones a la derecha (50%)

#### Scenario: Layout 100% para cliente
- **WHEN** un cliente ve el detalle de su ticket
- **THEN** ve solo el historial de estados ocupando el 100% del ancho
