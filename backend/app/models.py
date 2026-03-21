from datetime import UTC, datetime

from sqlmodel import Field, Relationship, SQLModel


# ─── Usuario ───────────────────────────────────────────────

class UsuarioBase(SQLModel):
    nombre: str
    email: str = Field(unique=True, index=True)


class Usuario(UsuarioBase, table=True):
    __tablename__ = "usuarios"

    id: int | None = Field(default=None, primary_key=True)
    password_hash: str
    rol: str = Field(default="cliente")
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    tickets_creados: list["Ticket"] = Relationship(back_populates="creador")
    observaciones: list["Observacion"] = Relationship(back_populates="autor")


class UsuarioCreate(SQLModel):
    nombre: str
    email: str
    password: str


class UsuarioRead(UsuarioBase):
    id: int
    rol: str
    created_at: datetime


# ─── Catálogos ─────────────────────────────────────────────

class Categoria(SQLModel, table=True):
    __tablename__ = "categorias"

    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(unique=True)


class CategoriaRead(SQLModel):
    id: int
    nombre: str


class Prioridad(SQLModel, table=True):
    __tablename__ = "prioridades"

    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(unique=True)
    orden: int = 0


class PrioridadRead(SQLModel):
    id: int
    nombre: str
    orden: int


class Estado(SQLModel, table=True):
    __tablename__ = "estados"

    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(unique=True)
    color: str = "#6b7280"


class EstadoRead(SQLModel):
    id: int
    nombre: str
    color: str


# ─── TicketAsignacion (M:N) ────────────────────────────────

class TicketAsignacion(SQLModel, table=True):
    __tablename__ = "ticket_asignaciones"

    ticket_id: int = Field(foreign_key="tickets.id", primary_key=True)
    usuario_id: int = Field(foreign_key="usuarios.id", primary_key=True)
    assigned_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


# ─── AsignacionHistorial ──────────────────────────────────

class AsignacionHistorial(SQLModel, table=True):
    __tablename__ = "asignacion_historial"

    id: int | None = Field(default=None, primary_key=True)
    ticket_id: int = Field(foreign_key="tickets.id")
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    usuario_ids: str = ""
    usuario_nombres: str = ""


class AsignacionHistorialRead(SQLModel):
    created_at: datetime
    usuario_nombres: list[str] = []


# ─── Ticket ────────────────────────────────────────────────

class Ticket(SQLModel, table=True):
    __tablename__ = "tickets"

    id: int | None = Field(default=None, primary_key=True)
    titulo: str
    descripcion: str
    categoria_id: int | None = Field(default=None, foreign_key="categorias.id")
    prioridad_id: int | None = Field(default=None, foreign_key="prioridades.id")
    estado_id: int = Field(foreign_key="estados.id")
    fragmento_codigo: str | None = None
    lenguaje_codigo: str | None = None
    resolucion: str | None = None
    motivo_rechazo: str | None = None
    creado_por: int | None = Field(default=None, foreign_key="usuarios.id")
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    creador: Usuario | None = Relationship(back_populates="tickets_creados")
    observaciones: list["Observacion"] = Relationship(back_populates="ticket")


class TicketCreate(SQLModel):
    titulo: str
    descripcion: str
    categoria_id: int | None = None
    prioridad_id: int | None = None
    fragmento_codigo: str | None = None
    lenguaje_codigo: str | None = None


class TicketRead(SQLModel):
    id: int
    titulo: str
    descripcion: str
    categoria: CategoriaRead | None = None
    prioridad: PrioridadRead | None = None
    estado: EstadoRead
    fragmento_codigo: str | None
    lenguaje_codigo: str | None
    resolucion: str | None
    motivo_rechazo: str | None
    creado_por: int | None
    creador_nombre: str | None = None
    asignados: list[UsuarioRead] = []
    created_at: datetime
    updated_at: datetime


class TicketUpdate(SQLModel):
    descripcion: str | None = None
    categoria_id: int | None = None
    prioridad_id: int | None = None


# ─── EstadoHistorial ──────────────────────────────────────

class EstadoHistorial(SQLModel, table=True):
    __tablename__ = "estado_historial"

    id: int | None = Field(default=None, primary_key=True)
    ticket_id: int = Field(foreign_key="tickets.id")
    estado_id: int = Field(foreign_key="estados.id")
    cambiado_por: int = Field(foreign_key="usuarios.id")
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


class EstadoHistorialRead(SQLModel):
    estado: EstadoRead
    cambiado_por_nombre: str | None = None
    created_at: datetime


# ─── Observacion ───────────────────────────────────────────

class ObservacionBase(SQLModel):
    contenido: str
    tipo_observacion: str | None = None


class Observacion(ObservacionBase, table=True):
    __tablename__ = "observaciones"

    id: int | None = Field(default=None, primary_key=True)
    ticket_id: int = Field(foreign_key="tickets.id")
    autor_id: int = Field(foreign_key="usuarios.id")
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    ticket: Ticket | None = Relationship(back_populates="observaciones")
    autor: Usuario | None = Relationship(back_populates="observaciones")


class ObservacionCreate(ObservacionBase):
    pass


class ObservacionRead(ObservacionBase):
    id: int
    ticket_id: int
    autor_id: int
    autor_nombre: str | None = None
    created_at: datetime


# ─── Request schemas ───────────────────────────────────────

class AsignadosRequest(SQLModel):
    usuario_ids: list[int]
