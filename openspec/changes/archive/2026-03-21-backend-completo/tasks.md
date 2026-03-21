## 1. Autenticación

- [x] 1.1 Implementar hasheo de contraseñas con passlib[bcrypt] en backend/app/routers/auth.py
- [x] 1.2 Implementar POST /api/register: crear usuario con password hasheado, validar email único (409 si duplicado)
- [x] 1.3 Implementar POST /api/login: verificar credenciales con bcrypt, firmar user_id con itsdangerous, establecer cookie httponly samesite=lax
- [x] 1.4 Implementar POST /api/logout: eliminar cookie de sesión
- [x] 1.5 Implementar GET /api/me: deserializar cookie, cargar usuario, retornar sin password_hash
- [x] 1.6 Implementar dependencia get_current_user: leer cookie "session", verificar firma y expiración (24h) con itsdangerous, retornar 401 si inválida
- [x] 1.7 Aplicar Depends(get_current_user) a todos los endpoints protegidos

## 2. CRUD de tickets

- [x] 2.1 Implementar POST /api/tickets: crear ticket con estado "Abierto", asignar creado_por desde sesión, registrar created_at
- [x] 2.2 Implementar GET /api/tickets/{id}: retornar ticket con observaciones cargadas, 404 si no existe
- [x] 2.3 Implementar PATCH /api/tickets/{id}: actualizar campos editables (descripcion, categoria, prioridad, asignado_a), registrar updated_at
- [x] 2.4 Implementar validación de campos obligatorios: titulo y descripcion requeridos (422 si faltan)

## 3. Sistema de estados

- [x] 3.1 Crear mapa TRANSICIONES_VALIDAS en backend/app/routers/tickets.py
- [x] 3.2 Implementar PATCH /api/tickets/{id}/estado: validar transición contra mapa, retornar 400 con estados válidos si es inválida
- [x] 3.3 Implementar PATCH /api/tickets/{id}/resolver: requerir campo resolucion, cambiar estado a "Resuelto" automáticamente, 422 si resolucion vacía

## 4. Observaciones

- [x] 4.1 Implementar POST /api/tickets/{id}/observaciones: crear observación con autor_id de sesión, tipo_observacion opcional, 400 si ticket cerrado
- [x] 4.2 Implementar GET /api/tickets/{id}/observaciones: retornar lista de observaciones con datos del autor

## 5. Filtrado y listado

- [x] 5.1 Implementar GET /api/tickets con query params opcionales (estado, prioridad, categoria), filtros AND, ordenado por created_at desc
