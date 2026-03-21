## Context

La infraestructura ya existe (Docker, PostgreSQL, modelos SQLModel, Alembic). Los endpoints están definidos como stubs. Este cambio implementa la lógica real dentro de la misma estructura.

## Goals / Non-Goals

**Goals:**

- Autenticación funcional con sesiones server-side
- CRUD completo de tickets con persistencia en PostgreSQL
- Validación estricta de transiciones de estado
- Observaciones técnicas categorizadas con bloqueo en tickets cerrados
- Filtrado de tickets por múltiples criterios

**Non-Goals:**

- Cambiar la estructura de archivos o modelos (ya definidos en cambio 1)
- Tocar el frontend (cambio 2)
- Deploy (cambio 4)

## Decisions

### 1. Sesiones con cookies firmadas (itsdangerous)

Usar `itsdangerous.URLSafeTimedSerializer` para firmar el user_id en una cookie. Sin Redis ni almacenamiento server-side — la cookie contiene el ID firmado y con timestamp.

```python
# Login: firmar user_id
serializer = URLSafeTimedSerializer(SECRET_KEY)
token = serializer.dumps(user.id)
response.set_cookie("session", token, httponly=True, samesite="lax")

# get_current_user: verificar cookie
user_id = serializer.loads(token, max_age=86400)  # 24h
```

**Alternativa considerada:** Flask-like session dict server-side. Descartado por requerir almacenamiento adicional.

### 2. Transiciones de estado como mapa explícito

```python
TRANSICIONES_VALIDAS = {
    "Abierto": ["En revisión"],
    "En revisión": ["En proceso"],
    "En proceso": ["Resuelto"],
    "Resuelto": ["Cerrado"],
    "Cerrado": [],
}
```

Una función `validar_transicion(actual, nuevo)` consulta el mapa. Rechaza cualquier transición no listada.

### 3. Hasheo de contraseñas con passlib + bcrypt

```python
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"])
```

Estándar, seguro, sin configuración compleja.

### 4. Filtrado con query params opcionales

```python
@router.get("/api/tickets")
def listar_tickets(
    estado: str | None = None,
    prioridad: str | None = None,
    categoria: str | None = None,
    session: Session = Depends(get_session)
):
    query = select(Ticket)
    if estado: query = query.where(Ticket.estado == estado)
    if prioridad: query = query.where(Ticket.prioridad == prioridad)
    if categoria: query = query.where(Ticket.categoria == categoria)
    return session.exec(query.order_by(Ticket.created_at.desc())).all()
```

## Risks / Trade-offs

- **[Cookie sin server-side storage]** → Si se compromete SECRET_KEY, todas las sesiones son vulnerables. Aceptable para proyecto académico. Mitigación: key larga en variable de entorno.
- **[Sin rate limiting]** → Endpoints de login sin protección contra brute force. Aceptable para el alcance. Mitigación futura: slowapi.
- **[Transiciones lineales estrictas]** → No permite saltar pasos (ej. cerrar directamente un ticket Abierto). Es intencional según la spec.
