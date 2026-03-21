from fastapi import APIRouter, Cookie, Depends, HTTPException, Response
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
from passlib.context import CryptContext
from sqlmodel import Session, select

from backend.app.config import settings
from backend.app.database import get_session
from backend.app.models import Usuario, UsuarioCreate, UsuarioRead

router = APIRouter(prefix="/api", tags=["Autenticación"])

pwd_context = CryptContext(schemes=["bcrypt"])
serializer = URLSafeTimedSerializer(settings.SECRET_KEY)

SESSION_MAX_AGE = 86400  # 24 horas


# ─── Dependencia de autenticación ──────────────────────────

from sqlmodel import SQLModel  # noqa: E402


class LoginRequest(SQLModel):
    email: str
    password: str


def get_current_user(
    session: str | None = Cookie(default=None),
    db: Session = Depends(get_session),
) -> Usuario:
    if not session:
        raise HTTPException(status_code=401, detail="No autenticado")
    try:
        user_id = serializer.loads(session, max_age=SESSION_MAX_AGE)
    except SignatureExpired:
        raise HTTPException(status_code=401, detail="Sesión expirada")
    except BadSignature:
        raise HTTPException(status_code=401, detail="Sesión inválida")

    user = db.get(Usuario, user_id)
    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")
    return user


# ─── Endpoints ─────────────────────────────────────────────

@router.post("/register", response_model=UsuarioRead, status_code=201)
def register(usuario: UsuarioCreate, db: Session = Depends(get_session)):
    """Registrar un nuevo usuario."""
    existing = db.exec(select(Usuario).where(Usuario.email == usuario.email)).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email ya registrado")

    user = Usuario(
        nombre=usuario.nombre,
        email=usuario.email,
        password_hash=pwd_context.hash(usuario.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=UsuarioRead)
def login(data: LoginRequest, response: Response, db: Session = Depends(get_session)):
    """Iniciar sesión con email y contraseña."""
    user = db.exec(select(Usuario).where(Usuario.email == data.email)).first()
    if not user or not pwd_context.verify(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    token = serializer.dumps(user.id)
    response.set_cookie(
        key="session",
        value=token,
        httponly=True,
        samesite="lax",
        max_age=SESSION_MAX_AGE,
    )
    return user


@router.post("/logout")
def logout(response: Response):
    """Cerrar sesión activa."""
    response.delete_cookie(key="session")
    return {"detail": "Sesión cerrada"}


@router.get("/me", response_model=UsuarioRead)
def me(current_user: Usuario = Depends(get_current_user)):
    """Obtener datos del usuario autenticado."""
    return current_user
