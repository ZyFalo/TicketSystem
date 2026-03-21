from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, SQLModel, select

from backend.app.database import get_session
from backend.app.models import (
    Observacion,
    ObservacionCreate,
    ObservacionRead,
    Ticket,
    TicketCreate,
    TicketRead,
    TicketUpdate,
    Usuario,
)
from backend.app.routers.auth import get_current_user

router = APIRouter(prefix="/api", tags=["Tickets"])


# ─── Request schemas ───────────────────────────────────────

class CambiarEstadoRequest(SQLModel):
    estado: str


class ResolverRequest(SQLModel):
    resolucion: str


# ─── Transiciones de estado ────────────────────────────────

TRANSICIONES_VALIDAS = {
    "Abierto": ["En revisión"],
    "En revisión": ["En proceso"],
    "En proceso": ["Resuelto"],
    "Resuelto": ["Cerrado"],
    "Cerrado": [],
}


# ─── Helpers ───────────────────────────────────────────────

def _get_ticket_or_404(ticket_id: int, db: Session) -> Ticket:
    ticket = db.get(Ticket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket no encontrado")
    return ticket


# ─── Endpoints ─────────────────────────────────────────────

@router.get("/tickets", response_model=list[TicketRead])
def listar_tickets(
    estado: str | None = None,
    prioridad: str | None = None,
    categoria: str | None = None,
    db: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user),
):
    """Listar tickets con filtros opcionales por estado, prioridad y categoría."""
    query = select(Ticket)
    if estado:
        query = query.where(Ticket.estado == estado)
    if prioridad:
        query = query.where(Ticket.prioridad == prioridad)
    if categoria:
        query = query.where(Ticket.categoria == categoria)
    query = query.order_by(Ticket.created_at.desc())
    return db.exec(query).all()


@router.post("/tickets", response_model=TicketRead, status_code=201)
def crear_ticket(
    ticket: TicketCreate,
    db: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user),
):
    """Crear un nuevo ticket de soporte."""
    db_ticket = Ticket(
        titulo=ticket.titulo,
        descripcion=ticket.descripcion,
        categoria=ticket.categoria,
        prioridad=ticket.prioridad,
        fragmento_codigo=ticket.fragmento_codigo,
        lenguaje_codigo=ticket.lenguaje_codigo,
        creado_por=current_user.id,
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket


@router.get("/tickets/{ticket_id}", response_model=TicketRead)
def obtener_ticket(
    ticket_id: int,
    db: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user),
):
    """Obtener un ticket por su ID."""
    return _get_ticket_or_404(ticket_id, db)


@router.patch("/tickets/{ticket_id}", response_model=TicketRead)
def actualizar_ticket(
    ticket_id: int,
    data: TicketUpdate,
    db: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user),
):
    """Actualizar campos editables de un ticket."""
    ticket = _get_ticket_or_404(ticket_id, db)
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(ticket, key, value)
    ticket.updated_at = datetime.now(UTC)
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


@router.patch("/tickets/{ticket_id}/estado", response_model=TicketRead)
def cambiar_estado(
    ticket_id: int,
    data: CambiarEstadoRequest,
    db: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user),
):
    """Cambiar el estado de un ticket siguiendo el flujo válido."""
    ticket = _get_ticket_or_404(ticket_id, db)

    estados_validos = TRANSICIONES_VALIDAS.get(ticket.estado, [])
    if data.estado not in estados_validos:
        raise HTTPException(
            status_code=400,
            detail=f"Transición inválida: '{ticket.estado}' → '{data.estado}'. Estados válidos desde '{ticket.estado}': {estados_validos}",
        )

    ticket.estado = data.estado
    ticket.updated_at = datetime.now(UTC)
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


@router.patch("/tickets/{ticket_id}/resolver", response_model=TicketRead)
def resolver_ticket(
    ticket_id: int,
    data: ResolverRequest,
    db: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user),
):
    """Resolver un ticket con texto de resolución obligatorio."""
    if not data.resolucion or not data.resolucion.strip():
        raise HTTPException(status_code=422, detail="El campo resolucion es obligatorio")

    ticket = _get_ticket_or_404(ticket_id, db)

    estados_validos = TRANSICIONES_VALIDAS.get(ticket.estado, [])
    if "Resuelto" not in estados_validos:
        raise HTTPException(
            status_code=400,
            detail=f"No se puede resolver desde estado '{ticket.estado}'. El ticket debe estar 'En proceso'.",
        )

    ticket.resolucion = data.resolucion.strip()
    ticket.estado = "Resuelto"
    ticket.updated_at = datetime.now(UTC)
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


@router.get(
    "/tickets/{ticket_id}/observaciones",
    response_model=list[ObservacionRead],
)
def listar_observaciones(
    ticket_id: int,
    db: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user),
):
    """Listar observaciones de un ticket."""
    _get_ticket_or_404(ticket_id, db)
    query = select(Observacion).where(Observacion.ticket_id == ticket_id).order_by(Observacion.created_at)
    return db.exec(query).all()


@router.post(
    "/tickets/{ticket_id}/observaciones",
    response_model=ObservacionRead,
    status_code=201,
)
def crear_observacion(
    ticket_id: int,
    observacion: ObservacionCreate,
    db: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user),
):
    """Agregar una observación a un ticket."""
    ticket = _get_ticket_or_404(ticket_id, db)

    if ticket.estado == "Cerrado":
        raise HTTPException(
            status_code=400,
            detail="No se pueden agregar observaciones a tickets cerrados",
        )

    db_obs = Observacion(
        ticket_id=ticket_id,
        autor_id=current_user.id,
        contenido=observacion.contenido,
        tipo_observacion=observacion.tipo_observacion,
    )
    db.add(db_obs)
    db.commit()
    db.refresh(db_obs)
    return db_obs
