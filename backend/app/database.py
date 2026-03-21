from collections.abc import Generator

from sqlmodel import Session, SQLModel, create_engine, select

from backend.app.config import settings

engine = create_engine(settings.DATABASE_URL, echo=False)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    seed_catalogos()


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


def seed_catalogos():
    from backend.app.models import Categoria, Estado, Prioridad

    with Session(engine) as session:
        # Solo insertar si no hay datos
        if session.exec(select(Estado)).first():
            return

        # Estados
        estados = [
            Estado(nombre="Pendiente", color="#f97316"),
            Estado(nombre="Abierto", color="#3b82f6"),
            Estado(nombre="En revisión", color="#f59e0b"),
            Estado(nombre="En proceso", color="#8b5cf6"),
            Estado(nombre="Resuelto", color="#10b981"),
            Estado(nombre="Cerrado", color="#6b7280"),
            Estado(nombre="Rechazado", color="#dc2626"),
        ]
        for e in estados:
            session.add(e)

        # Categorías
        categorias = [
            Categoria(nombre="Servidor"),
            Categoria(nombre="Base de Datos"),
            Categoria(nombre="Frontend"),
            Categoria(nombre="Bug"),
            Categoria(nombre="Consulta"),
            Categoria(nombre="Mejora"),
            Categoria(nombre="Revisión de código"),
        ]
        for c in categorias:
            session.add(c)

        # Prioridades
        prioridades = [
            Prioridad(nombre="Baja", orden=1),
            Prioridad(nombre="Media", orden=2),
            Prioridad(nombre="Alta", orden=3),
        ]
        for p in prioridades:
            session.add(p)

        session.commit()
