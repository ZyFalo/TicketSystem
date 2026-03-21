from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, SQLModel, select

from backend.app.database import get_session
from backend.app.models import Usuario, UsuarioRead
from backend.app.routers.auth import require_senior

router = APIRouter(prefix="/api", tags=["Usuarios"])


class CambiarRolRequest(SQLModel):
    rol: str


@router.get("/usuarios", response_model=list[UsuarioRead])
def listar_usuarios(
    db: Session = Depends(get_session),
    current_user: Usuario = Depends(require_senior),
):
    """Listar todos los usuarios (solo senior)."""
    usuarios = db.exec(select(Usuario).order_by(Usuario.id)).all()
    return usuarios


@router.patch("/usuarios/{usuario_id}/rol", response_model=UsuarioRead)
def cambiar_rol(
    usuario_id: int,
    data: CambiarRolRequest,
    db: Session = Depends(get_session),
    current_user: Usuario = Depends(require_senior),
):
    """Cambiar rol de un usuario (solo senior). Roles: cliente, developer, senior."""
    if data.rol not in ("cliente", "developer", "senior"):
        raise HTTPException(status_code=400, detail="Rol inválido. Opciones: cliente, developer, senior")

    user = db.get(Usuario, usuario_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    user.rol = data.rol
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
