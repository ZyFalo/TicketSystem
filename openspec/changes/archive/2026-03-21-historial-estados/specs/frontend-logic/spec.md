## MODIFIED Requirements

### Requirement: Lógica de detalle (detalle.js)
El detalle SHALL cargar el historial de estados desde GET /api/tickets/{id}/historial-estados y renderizarlo con fecha y estado. Para clientes, ocultar el nombre de quién ejecutó el cambio.

#### Scenario: Historial de estados renderizado
- **WHEN** se carga el detalle de un ticket
- **THEN** se muestra la lista de cambios de estado ordenada DESC por fecha

#### Scenario: Cliente sin nombres
- **WHEN** un cliente ve el historial de estados
- **THEN** cada entrada muestra solo fecha y nombre del estado, sin el ejecutor
