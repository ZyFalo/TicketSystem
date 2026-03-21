## 1. Modelo

- [x] 1.1 Crear modelo EstadoHistorial (id, ticket_id FK, estado_id FK, cambiado_por FK, created_at) en models.py
- [x] 1.2 Crear schema EstadoHistorialRead (estado: EstadoRead, cambiado_por_nombre: str|None, created_at)

## 2. Backend: registrar historial

- [x] 2.1 Crear helper _registrar_cambio_estado(ticket_id, estado_id, usuario_id, db) que inserta en estado_historial
- [x] 2.2 Llamar helper al crear ticket (estado Pendiente, cambiado_por = creador)
- [x] 2.3 Llamar helper al cambiar estado via endpoint /estado (nuevo estado, cambiado_por = usuario actual)

## 3. Backend: endpoint de consulta

- [x] 3.1 Crear GET /api/tickets/{id}/historial-estados que retorna list[EstadoHistorialRead] ordenado por created_at DESC
- [x] 3.2 Incluir cambiado_por_nombre resuelto desde tabla usuarios

## 4. Frontend: HTML

- [x] 4.1 Modificar detalle.html: envolver historial de estados y asignaciones en un div flex con gap, cada uno flex:1
- [x] 4.2 Agregar sección de historial de estados en el div izquierdo

## 5. Frontend: JS

- [x] 5.1 Crear función loadHistorialEstados() en detalle.js que consulta GET /api/tickets/{id}/historial-estados
- [x] 5.2 Renderizar lista DESC: fecha + badge estado + nombre ejecutor (si no es cliente)
- [x] 5.3 Para cliente: ocultar historial de asignaciones, historial de estados ocupa 100%
- [x] 5.4 Para senior/developer: ambos historiales al 50%

## 6. CSS

- [x] 6.1 Agregar estilos .historial-container (display:flex, gap) y .historial-container > div (flex:1) en _tickets.scss
- [x] 6.2 Compilar SCSS

## 7. Verificación

- [x] 7.1 Rebuild Docker, test: crear ticket → cambiar estados → verificar historial
