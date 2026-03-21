import json
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, SQLModel, select

from backend.app.database import get_session
from backend.app.models import (
    AsignacionHistorial,
    AsignacionHistorialRead,
    AsignadosRequest,
    Categoria,
    CategoriaRead,
    Estado,
    EstadoHistorial,
    EstadoHistorialRead,
    EstadoRead,
    Observacion,
    ObservacionCreate,
    ObservacionRead,
    Prioridad,
    PrioridadRead,
    Ticket,
    TicketAsignacion,
    TicketCreate,
    TicketRead,
    TicketUpdate,
    Usuario,
    UsuarioRead,
)
from backend.app.routers.auth import get_current_user, require_senior

router = APIRouter(prefix="/api", tags=["Tickets"])


# ─── Request schemas ───────────────────────────────────────

class CambiarEstadoRequest(SQLModel):
    estado: str  # nombre del estado destino
    resolucion: str | None = None
    motivo_rechazo: str | None = None


# ─── Transiciones de estado por rol (por nombre) ──────────

TRANSICIONES_SENIOR = {
    "Pendiente": ["Abierto", "Rechazado"],
    "Abierto": ["En revisión"],
    "En revisión": ["En proceso"],
    "En proceso": ["Resuelto", "En revisión"],
    "Resuelto": ["Cerrado", "En proceso"],
}

TRANSICIONES_DEVELOPER = {
    "Abierto": ["En revisión"],
    "En revisión": ["En proceso"],
    "En proceso": ["Resuelto", "En revisión"],
}

TRANSICIONES_CLIENTE = {}

ESTADOS_VISIBLES = {
    "cliente": ["Pendiente", "Abierto", "En revisión", "En proceso", "Resuelto", "Cerrado", "Rechazado"],
    "developer": ["Abierto", "En revisión", "En proceso", "Resuelto", "Cerrado"],
    "senior": ["Pendiente", "Abierto", "En revisión", "En proceso", "Resuelto", "Cerrado", "Rechazado"],
}


# ─── Helpers ───────────────────────────────────────────────

def _get_ticket_or_404(ticket_id: int, db: Session) -> Ticket:
    ticket = db.get(Ticket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket no encontrado")
    return ticket


def _get_estado_by_nombre(nombre: str, db: Session) -> Estado:
    estado = db.exec(select(Estado).where(Estado.nombre == nombre)).first()
    if not estado:
        raise HTTPException(status_code=400, detail=f"Estado '{nombre}' no encontrado")
    return estado


def _get_estado_inicial(db: Session) -> Estado:
    return _get_estado_by_nombre("Pendiente", db)


def _get_asignados(ticket_id: int, db: Session) -> list[Usuario]:
    query = (
        select(Usuario)
        .join(TicketAsignacion, TicketAsignacion.usuario_id == Usuario.id)
        .where(TicketAsignacion.ticket_id == ticket_id)
    )
    return list(db.exec(query).all())


def _is_asignado(ticket_id: int, usuario_id: int, db: Session) -> bool:
    asignacion = db.get(TicketAsignacion, (ticket_id, usuario_id))
    return asignacion is not None


def _enrich_ticket_read(ticket: Ticket, db: Session) -> TicketRead:
    creador = db.get(Usuario, ticket.creado_por) if ticket.creado_por else None
    asignados = _get_asignados(ticket.id, db)
    estado = db.get(Estado, ticket.estado_id)
    categoria = db.get(Categoria, ticket.categoria_id) if ticket.categoria_id else None
    prioridad = db.get(Prioridad, ticket.prioridad_id) if ticket.prioridad_id else None

    return TicketRead(
        id=ticket.id,
        titulo=ticket.titulo,
        descripcion=ticket.descripcion,
        categoria=CategoriaRead.model_validate(categoria) if categoria else None,
        prioridad=PrioridadRead.model_validate(prioridad) if prioridad else None,
        estado=EstadoRead.model_validate(estado),
        fragmento_codigo=ticket.fragmento_codigo,
        lenguaje_codigo=ticket.lenguaje_codigo,
        resolucion=ticket.resolucion,
        motivo_rechazo=ticket.motivo_rechazo,
        creado_por=ticket.creado_por,
        creador_nombre=creador.nombre if creador else None,
        asignados=[UsuarioRead.model_validate(u) for u in asignados],
        created_at=ticket.created_at,
        updated_at=ticket.updated_at,
    )


def _registrar_cambio_estado(ticket_id: int, estado_id: int, usuario_id: int, db: Session):
    db.add(EstadoHistorial(
        ticket_id=ticket_id,
        estado_id=estado_id,
        cambiado_por=usuario_id,
    ))


def _save_historial_snapshot(ticket_id: int, db: Session):
    asignados = _get_asignados(ticket_id, db)
    historial = AsignacionHistorial(
        ticket_id=ticket_id,
        usuario_ids=json.dumps([u.id for u in asignados]),
        usuario_nombres=json.dumps([u.nombre for u in asignados]),
    )
    db.add(historial)


# ─── Endpoints: Opciones ──────────────────────────────────

@router.get("/tickets/opciones")
def opciones_filtro(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    """Retorna estados, prioridades y categorías desde BD según rol."""
    all_estados = db.exec(select(Estado)).all()
    nombres_visibles = ESTADOS_VISIBLES.get(current_user.rol, [])
    estados = [EstadoRead.model_validate(e) for e in all_estados if e.nombre in nombres_visibles]

    categorias = [CategoriaRead.model_validate(c) for c in db.exec(select(Categoria)).all()]
    prioridades = [PrioridadRead.model_validate(p) for p in db.exec(select(Prioridad).order_by(Prioridad.orden)).all()]

    return {"estados": estados, "categorias": categorias, "prioridades": prioridades}


# ─── Endpoints: Tickets ───────────────────────────────────

@router.get("/tickets", response_model=list[TicketRead])
def listar_tickets(
    estado_id: int | None = None,
    prioridad_id: int | None = None,
    categoria_id: int | None = None,
    mis_tickets: bool = False,
    db: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user),
):
    """Listar tickets filtrados por rol."""
    query = select(Ticket)

    # Visibilidad por rol
    if current_user.rol == "cliente":
        query = query.where(Ticket.creado_por == current_user.id)
    elif current_user.rol == "developer":
        # Excluir Pendiente y Rechazado por estado_id
        estados_excluidos = db.exec(
            select(Estado.id).where(Estado.nombre.in_(["Pendiente", "Rechazado"]))
        ).all()
        if estados_excluidos:
            query = query.where(Ticket.estado_id.not_in(estados_excluidos))

    # Filtros opcionales
    if estado_id:
        query = query.where(Ticket.estado_id == estado_id)
    if prioridad_id:
        query = query.where(Ticket.prioridad_id == prioridad_id)
    if categoria_id:
        query = query.where(Ticket.categoria_id == categoria_id)
    if mis_tickets:
        query = query.join(TicketAsignacion, TicketAsignacion.ticket_id == Ticket.id).where(
            TicketAsignacion.usuario_id == current_user.id
        )

    query = query.order_by(Ticket.updated_at.desc(), Ticket.created_at.desc())
    tickets = db.exec(query).all()
    return [_enrich_ticket_read(t, db) for t in tickets]


@router.post("/tickets", response_model=TicketRead, status_code=201)
def crear_ticket(
    ticket: TicketCreate,
    db: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user),
):
    """Crear ticket (cliente o senior). Developer no puede crear."""
    if current_user.rol == "developer":
        raise HTTPException(status_code=403, detail="Los developers no pueden crear tickets")

    estado_inicial = _get_estado_inicial(db)

    db_ticket = Ticket(
        titulo=ticket.titulo,
        descripcion=ticket.descripcion,
        fragmento_codigo=ticket.fragmento_codigo,
        lenguaje_codigo=ticket.lenguaje_codigo,
        estado_id=estado_inicial.id,
        creado_por=current_user.id,
    )

    # Senior puede incluir categoría y prioridad
    if current_user.rol == "senior":
        db_ticket.categoria_id = ticket.categoria_id
        db_ticket.prioridad_id = ticket.prioridad_id

    db.add(db_ticket)
    db.flush()
    _registrar_cambio_estado(db_ticket.id, estado_inicial.id, current_user.id, db)
    db.commit()
    db.refresh(db_ticket)
    return _enrich_ticket_read(db_ticket, db)


@router.get("/tickets/{ticket_id}", response_model=TicketRead)
def obtener_ticket(
    ticket_id: int,
    db: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user),
):
    """Obtener un ticket por su ID."""
    ticket = _get_ticket_or_404(ticket_id, db)
    return _enrich_ticket_read(ticket, db)


@router.patch("/tickets/{ticket_id}", response_model=TicketRead)
def actualizar_ticket(
    ticket_id: int,
    data: TicketUpdate,
    db: Session = Depends(get_session),
    current_user: Usuario = Depends(require_senior),
):
    """Actualizar campos editables (solo senior)."""
    ticket = _get_ticket_or_404(ticket_id, db)
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(ticket, key, value)
    ticket.updated_at = datetime.now(UTC)
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return _enrich_ticket_read(ticket, db)


@router.delete("/tickets/{ticket_id}")
def cancelar_ticket(
    ticket_id: int,
    db: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user),
):
    """Cancelar (eliminar) ticket. Solo el creador, solo si está Pendiente."""
    ticket = _get_ticket_or_404(ticket_id, db)

    if ticket.creado_por != current_user.id:
        raise HTTPException(status_code=403, detail="Solo el creador puede cancelar este ticket")

    estado = db.get(Estado, ticket.estado_id)
    if estado.nombre != "Pendiente":
        raise HTTPException(status_code=400, detail="Solo se pueden cancelar tickets en estado Pendiente")

    db.delete(ticket)
    db.commit()
    return {"detail": "Ticket cancelado"}


@router.patch("/tickets/{ticket_id}/estado", response_model=TicketRead)
def cambiar_estado(
    ticket_id: int,
    data: CambiarEstadoRequest,
    db: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user),
):
    """Cambiar estado según rol y asignación."""
    ticket = _get_ticket_or_404(ticket_id, db)
    estado_actual = db.get(Estado, ticket.estado_id)
    estado_destino = _get_estado_by_nombre(data.estado, db)

    # Seleccionar mapa de transiciones por rol
    if current_user.rol == "cliente":
        raise HTTPException(status_code=403, detail="Los clientes no pueden cambiar el estado de tickets")
    elif current_user.rol == "senior":
        transiciones = TRANSICIONES_SENIOR
    else:
        if not _is_asignado(ticket_id, current_user.id, db):
            raise HTTPException(status_code=403, detail="No estás asignado a este ticket")
        transiciones = TRANSICIONES_DEVELOPER

    estados_validos = transiciones.get(estado_actual.nombre, [])
    if data.estado not in estados_validos:
        raise HTTPException(
            status_code=400,
            detail=f"Transición inválida para rol '{current_user.rol}': '{estado_actual.nombre}' → '{data.estado}'. Estados válidos: {estados_validos}",
        )

    # Validaciones especiales
    if estado_actual.nombre == "Pendiente" and data.estado == "Abierto":
        if not ticket.categoria_id:
            raise HTTPException(status_code=400, detail="Se requiere categoría para clasificar el ticket")
        if not ticket.prioridad_id:
            raise HTTPException(status_code=400, detail="Se requiere prioridad para clasificar el ticket")
        asignados = _get_asignados(ticket_id, db)
        if not asignados:
            raise HTTPException(status_code=400, detail="Se requiere al menos un responsable asignado para clasificar")

    if estado_actual.nombre == "Pendiente" and data.estado == "Rechazado":
        if not data.motivo_rechazo or not data.motivo_rechazo.strip():
            raise HTTPException(status_code=422, detail="El motivo de rechazo es obligatorio")
        ticket.motivo_rechazo = data.motivo_rechazo.strip()

    if estado_actual.nombre == "Abierto" and data.estado == "En revisión":
        asignados = _get_asignados(ticket_id, db)
        if not asignados:
            raise HTTPException(status_code=400, detail="Se requiere al menos un responsable asignado para avanzar")

    if data.estado == "Resuelto" and data.resolucion:
        ticket.resolucion = data.resolucion.strip()

    ticket.estado_id = estado_destino.id
    ticket.updated_at = datetime.now(UTC)
    db.add(ticket)
    _registrar_cambio_estado(ticket_id, estado_destino.id, current_user.id, db)
    db.commit()
    db.refresh(ticket)
    return _enrich_ticket_read(ticket, db)


# ─── Endpoints: Asignaciones ──────────────────────────────

@router.put("/tickets/{ticket_id}/asignados", response_model=list[UsuarioRead])
def asignar_responsables(
    ticket_id: int,
    data: AsignadosRequest,
    db: Session = Depends(get_session),
    current_user: Usuario = Depends(require_senior),
):
    """Reemplazar lista de asignados (solo senior)."""
    ticket = _get_ticket_or_404(ticket_id, db)

    existing = db.exec(select(TicketAsignacion).where(TicketAsignacion.ticket_id == ticket_id)).all()
    for a in existing:
        db.delete(a)

    for uid in data.usuario_ids:
        user = db.get(Usuario, uid)
        if not user:
            raise HTTPException(status_code=404, detail=f"Usuario {uid} no encontrado")
        db.add(TicketAsignacion(ticket_id=ticket_id, usuario_id=uid))

    # Si lista queda vacía, volver a Pendiente
    if not data.usuario_ids:
        estado_pendiente = _get_estado_by_nombre("Pendiente", db)
        estado_actual = db.get(Estado, ticket.estado_id)
        if estado_actual.nombre != "Pendiente":
            ticket.estado_id = estado_pendiente.id
            ticket.updated_at = datetime.now(UTC)
            db.add(ticket)
            _registrar_cambio_estado(ticket_id, estado_pendiente.id, current_user.id, db)

    db.flush()
    _save_historial_snapshot(ticket_id, db)
    db.commit()

    return [UsuarioRead.model_validate(db.get(Usuario, uid)) for uid in data.usuario_ids]


@router.get("/tickets/{ticket_id}/asignados", response_model=list[UsuarioRead])
def listar_asignados(
    ticket_id: int,
    db: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user),
):
    """Listar responsables actuales de un ticket."""
    _get_ticket_or_404(ticket_id, db)
    asignados = _get_asignados(ticket_id, db)
    return [UsuarioRead.model_validate(u) for u in asignados]


@router.get("/tickets/{ticket_id}/historial-asignaciones", response_model=list[AsignacionHistorialRead])
def historial_asignaciones(
    ticket_id: int,
    db: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user),
):
    """Historial de cambios de asignación."""
    _get_ticket_or_404(ticket_id, db)
    query = select(AsignacionHistorial).where(
        AsignacionHistorial.ticket_id == ticket_id
    ).order_by(AsignacionHistorial.created_at.desc())
    entries = db.exec(query).all()
    return [
        AsignacionHistorialRead(
            created_at=e.created_at,
            usuario_nombres=json.loads(e.usuario_nombres) if e.usuario_nombres else [],
        )
        for e in entries
    ]


# ─── Endpoints: Historial de estados ──────────────────────

@router.get("/tickets/{ticket_id}/historial-estados", response_model=list[EstadoHistorialRead])
def historial_estados(
    ticket_id: int,
    db: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user),
):
    """Historial de cambios de estado de un ticket."""
    _get_ticket_or_404(ticket_id, db)
    query = select(EstadoHistorial).where(
        EstadoHistorial.ticket_id == ticket_id
    ).order_by(EstadoHistorial.created_at.desc())
    entries = db.exec(query).all()
    result = []
    for e in entries:
        estado = db.get(Estado, e.estado_id)
        usuario = db.get(Usuario, e.cambiado_por)
        result.append(EstadoHistorialRead(
            estado=EstadoRead.model_validate(estado),
            cambiado_por_nombre=usuario.nombre if usuario else None,
            created_at=e.created_at,
        ))
    return result


# ─── Endpoints: Observaciones ─────────────────────────────

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
    observaciones = db.exec(query).all()
    result = []
    for obs in observaciones:
        autor = db.get(Usuario, obs.autor_id)
        read = ObservacionRead.model_validate(obs)
        read.autor_nombre = autor.nombre if autor else None
        result.append(read)
    return result


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
    estado = db.get(Estado, ticket.estado_id)

    if estado.nombre in ("Cerrado", "Rechazado"):
        raise HTTPException(
            status_code=400,
            detail="No se pueden agregar observaciones a tickets cerrados o rechazados",
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
    read = ObservacionRead.model_validate(db_obs)
    read.autor_nombre = current_user.nombre
    return read
