## ADDED Requirements

### Requirement: Registro de usuario
El sistema SHALL permitir crear cuentas de usuario con nombre, email y contraseña.

#### Scenario: Registro exitoso
- **WHEN** un visitante envía nombre, email único y contraseña válida
- **THEN** el sistema crea la cuenta con la contraseña hasheada y redirige al login

#### Scenario: Email duplicado
- **WHEN** un visitante intenta registrarse con un email ya existente
- **THEN** el sistema rechaza el registro e indica que el email ya está en uso

### Requirement: Login con sesiones
El sistema SHALL permitir autenticarse con email y contraseña, creando una sesión server-side con cookie.

#### Scenario: Login exitoso
- **WHEN** un usuario envía email y contraseña correctos
- **THEN** el sistema crea una sesión, establece la cookie y responde con los datos del usuario

#### Scenario: Credenciales incorrectas
- **WHEN** un usuario envía email o contraseña incorrectos
- **THEN** el sistema responde con error 401 sin revelar cuál campo es incorrecto

### Requirement: Logout
El sistema SHALL permitir cerrar la sesión activa.

#### Scenario: Logout exitoso
- **WHEN** un usuario autenticado solicita cerrar sesión
- **THEN** el sistema destruye la sesión y elimina la cookie

### Requirement: Protección de rutas
Las rutas de la API bajo /api/ (excepto login y registro) SHALL requerir una sesión activa.

#### Scenario: Acceso autenticado
- **WHEN** un usuario con sesión activa hace una petición a un endpoint protegido
- **THEN** el sistema procesa la petición normalmente

#### Scenario: Acceso no autenticado
- **WHEN** un visitante sin sesión hace una petición a un endpoint protegido
- **THEN** el sistema responde con error 401

### Requirement: Consultar usuario actual
El sistema SHALL exponer un endpoint /api/me que retorne los datos del usuario autenticado.

#### Scenario: Usuario autenticado
- **WHEN** un usuario con sesión activa consulta /api/me
- **THEN** el sistema responde con id, nombre y email (sin contraseña)
