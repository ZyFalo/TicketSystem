## MODIFIED Requirements

### Requirement: Login con sesiones
El sistema SHALL permitir autenticarse con email y contraseña, creando una sesión mediante cookie firmada con itsdangerous (URLSafeTimedSerializer). La cookie SHALL ser httponly, samesite=lax, con expiración de 24 horas.

#### Scenario: Login exitoso
- **WHEN** un usuario envía email y contraseña correctos
- **THEN** el sistema verifica la contraseña con bcrypt, firma el user_id con itsdangerous, establece cookie "session" httponly y responde con los datos del usuario

#### Scenario: Credenciales incorrectas
- **WHEN** un usuario envía email o contraseña incorrectos
- **THEN** el sistema responde con error 401 sin revelar cuál campo es incorrecto

### Requirement: Protección de rutas
Las rutas de la API bajo /api/ (excepto login, registro y archivos estáticos) SHALL requerir una cookie de sesión válida verificada con itsdangerous.

#### Scenario: Acceso autenticado
- **WHEN** un usuario con cookie de sesión válida (firmada y no expirada) hace una petición a un endpoint protegido
- **THEN** el sistema deserializa el user_id, carga el usuario de la BD y procesa la petición

#### Scenario: Acceso no autenticado
- **WHEN** un visitante sin cookie o con cookie expirada/inválida hace una petición a un endpoint protegido
- **THEN** el sistema responde con error 401

#### Scenario: Cookie expirada
- **WHEN** un usuario hace una petición con una cookie firmada hace más de 24 horas
- **THEN** el sistema responde con error 401
