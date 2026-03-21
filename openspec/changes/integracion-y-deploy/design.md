## Context

Frontend y backend están completos por separado. FastAPI ya tiene los endpoints reales. El frontend tiene HTML, JS y SCSS. Falta conectarlos y deployar.

## Goals / Non-Goals

**Goals:**

- FastAPI sirve frontend como archivos estáticos
- SCSS se compila a CSS durante el build de Docker
- Un solo `docker-compose up` levanta todo funcional
- Deploy exitoso en Railway
- README con instrucciones claras

**Non-Goals:**

- CDN o servidor estático separado (Nginx)
- CI/CD pipeline (fuera del alcance)
- Dominio personalizado

## Decisions

### 1. FastAPI monta StaticFiles

```python
from fastapi.staticfiles import StaticFiles

app.mount("/static", StaticFiles(directory="frontend"), name="static")
```

HTML se sirve desde `/static/html/index.html`. CSS compilado en `/static/css/main.css`. JS en `/static/js/`.

### 2. Rutas catch-all para páginas

FastAPI define rutas que retornan los archivos HTML:

```python
from fastapi.responses import FileResponse

@app.get("/")
def index():
    return FileResponse("frontend/html/index.html")

@app.get("/login")
def login_page():
    return FileResponse("frontend/html/login.html")

# ... etc para cada página
```

### 3. Compilación SCSS en Dockerfile

```dockerfile
RUN npm install -g sass
COPY frontend/scss/ /app/frontend/scss/
RUN sass frontend/scss/main.scss frontend/css/main.css --style=compressed
```

### 4. Railway con Dockerfile

Railway detecta el Dockerfile automáticamente. Variables de entorno (DATABASE_URL, SECRET_KEY) se configuran en el dashboard de Railway.

## Risks / Trade-offs

- **[dart-sass requiere npm en Docker]** → Agrega tamaño a la imagen. Mitigación: usar multi-stage build (stage 1 compila SCSS, stage 2 solo Python).
- **[Rutas hardcodeadas para HTML]** → Si se agrega una página, hay que agregar la ruta. Aceptable para 6 páginas.
