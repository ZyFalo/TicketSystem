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
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    tickets_creados: list["Ticket"] = Relationship(
        back_populates="creador",
        sa_relationship_kwargs={"foreign_keys": "Ticket.creado_por"},
    )
    tickets_asignados: list["Ticket"] = Relationship(
        back_populates="asignado",
        sa_relationship_kwargs={"foreign_keys": "Ticket.asignado_a"},
    )
    observaciones: list["Observacion"] = Relationship(back_populates="autor")


class UsuarioCreate(SQLModel):
    nombre: str
    email: str
    password: str


class UsuarioRead(UsuarioBase):
    id: int
    created_at: datetime


# ─── Ticket ────────────────────────────────────────────────

class TicketBase(SQLModel):
    titulo: str
    descripcion: str
    categoria: str
    prioridad: str


class Ticket(TicketBase, table=True):
    __tablename__ = "tickets"

    id: int | None = Field(default=None, primary_key=True)
    estado: str = Field(default="Abierto")
    fragmento_codigo: str | None = None
    lenguaje_codigo: str | None = None
    resolucion: str | None = None
    creado_por: int | None = Field(default=None, foreign_key="usuarios.id")
    asignado_a: int | None = Field(default=None, foreign_key="usuarios.id")
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    creador: Usuario | None = Relationship(
        back_populates="tickets_creados",
        sa_relationship_kwargs={"foreign_keys": "[Ticket.creado_por]"},
    )
    asignado: Usuario | None = Relationship(
        back_populates="tickets_asignados",
        sa_relationship_kwargs={"foreign_keys": "[Ticket.asignado_a]"},
    )
    observaciones: list["Observacion"] = Relationship(back_populates="ticket")


class TicketCreate(TicketBase):
    fragmento_codigo: str | None = None
    lenguaje_codigo: str | None = None


class TicketRead(TicketBase):
    id: int
    estado: str
    fragmento_codigo: str | None
    lenguaje_codigo: str | None
    resolucion: str | None
    creado_por: int | None
    asignado_a: int | None
    created_at: datetime
    updated_at: datetime


class TicketUpdate(SQLModel):
    descripcion: str | None = None
    categoria: str | None = None
    prioridad: str | None = None
    asignado_a: int | None = None


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
    created_at: datetime
