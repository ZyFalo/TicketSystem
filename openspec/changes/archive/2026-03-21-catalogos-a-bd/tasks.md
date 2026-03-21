## 1. Modelos de catálogo

- [x] 1.1 Crear modelos Categoria (id, nombre), Prioridad (id, nombre, orden), Estado (id, nombre, color) en models.py
- [x] 1.2 Crear schemas de lectura: CategoriaRead, PrioridadRead, EstadoRead
- [x] 1.3 Modificar Ticket: reemplazar campos string (categoria, prioridad, estado) por FK (categoria_id, prioridad_id, estado_id)
- [x] 1.4 Modificar TicketCreate: recibir categoria_id y prioridad_id (int | None) en vez de strings
- [x] 1.5 Modificar TicketRead: devolver objetos CategoriaRead, PrioridadRead, EstadoRead en vez de strings
- [x] 1.6 Modificar TicketUpdate: usar categoria_id y prioridad_id
- [x] 1.7 Eliminar campo motivo_rechazo de TicketRead si no cambia (verificar que sigue presente)

## 2. Migración Alembic

- [x] 2.1 Crear tablas categorias, prioridades, estados
- [x] 2.2 Insertar seed: 7 categorías, 3 prioridades con orden, 7 estados con color
- [x] 2.3 Agregar columnas categoria_id, prioridad_id, estado_id a tickets (nullable inicialmente)
- [x] 2.4 Poblar FK desde strings existentes: UPDATE tickets SET categoria_id = (SELECT id FROM categorias WHERE nombre = tickets.categoria)
- [x] 2.5 Hacer estado_id NOT NULL tras poblar
- [x] 2.6 Eliminar columnas string: categoria, prioridad, estado

## 3. Backend: endpoints de tickets

- [x] 3.1 Modificar _enrich_ticket_read: resolver categoria, prioridad y estado desde FK con join/get
- [x] 3.2 Modificar crear_ticket: recibir categoria_id/prioridad_id, resolver estado_id de "Pendiente" desde tabla
- [x] 3.3 Modificar cambiar_estado: consultar estado actual y destino por nombre desde tabla estados, guardar estado_id
- [x] 3.4 Modificar actualizar_ticket: aceptar categoria_id y prioridad_id en vez de strings
- [x] 3.5 Modificar listar_tickets: filtros por estado_id, prioridad_id, categoria_id en vez de strings
- [x] 3.6 Modificar endpoint /opciones: consultar tablas, retornar objetos {id, nombre, color/orden}
- [x] 3.7 Eliminar listas hardcodeadas PRIORIDADES, CATEGORIAS de tickets.py
- [x] 3.8 Adaptar TRANSICIONES_* y ESTADOS_VISIBLES para trabajar con nombres pero resolver IDs desde tabla

## 4. Backend: helpers y validaciones

- [x] 4.1 Crear helper get_estado_by_nombre(nombre, db) → Estado que consulta tabla estados
- [x] 4.2 Crear helper get_estado_inicial(db) → Estado "Pendiente"
- [x] 4.3 Adaptar validación Pendiente→Abierto: verificar categoria_id y prioridad_id no null
- [x] 4.4 Adaptar lógica de auto-reset a Pendiente cuando se remueven asignados

## 5. Frontend: selects con IDs

- [x] 5.1 Modificar tickets.js: loadOpciones llena selects con value=ID, filtros envían IDs como query params
- [x] 5.2 Modificar crear.js: loadOpciones llena selects categoría/prioridad con value=ID, payload envía IDs
- [x] 5.3 Modificar detalle.js: loadOpcionesClasificacion llena selects con value=ID, guardar envía IDs
- [x] 5.4 Modificar detalle.js: select de estado usa value=ID, envía estado_id al cambiar

## 6. Frontend: badges dinámicos

- [x] 6.1 Modificar getBadgeEstado en tickets.js y detalle.js: usar estado.color de la BD en vez de clases CSS
- [x] 6.2 Modificar getBadgePrioridad: usar nombre directamente (sin clases hardcodeadas)
- [x] 6.3 Adaptar detalle.js: renderizar categoría y prioridad desde objetos {id, nombre}

## 7. Verificación

- [x] 7.1 Rebuild Docker con BD limpia, verificar seed de datos
- [x] 7.2 Test flujo completo: crear ticket, clasificar, asignar, cambiar estados, filtrar
