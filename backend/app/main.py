from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from backend.app.database import create_db_and_tables
from backend.app.routers import auth, tickets, usuarios


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(
    title="Sistema de Tickets - Soporte Técnico",
    description="API para gestión de tickets de soporte técnico y revisión de fragmentos de código",
    version="0.2.0",
    lifespan=lifespan,
)

app.include_router(auth.router)
app.include_router(tickets.router)
app.include_router(usuarios.router)


# ─── Rutas de páginas HTML ─────────────────────────────────

@app.get("/", include_in_schema=False)
def index_page():
    return FileResponse("frontend/html/index.html")


@app.get("/login", include_in_schema=False)
def login_page():
    return FileResponse("frontend/html/login.html")


@app.get("/crear", include_in_schema=False)
def crear_page():
    return FileResponse("frontend/html/crear.html")


@app.get("/tickets", include_in_schema=False)
def tickets_page():
    return FileResponse("frontend/html/tickets.html")


@app.get("/ticket/{ticket_id}", include_in_schema=False)
def detalle_page(ticket_id: int):
    return FileResponse("frontend/html/detalle.html")


@app.get("/usuarios", include_in_schema=False)
def usuarios_page():
    return FileResponse("frontend/html/usuarios.html")


# ─── Archivos estáticos (CSS, JS, etc.) ───────────────────

app.mount("/static", StaticFiles(directory="frontend"), name="static")
