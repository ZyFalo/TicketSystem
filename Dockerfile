# Stage 1: Compilar SCSS a CSS
FROM node:20-slim AS scss-builder
WORKDIR /build
COPY frontend/scss/ ./scss/
RUN npm install -g sass && \
    mkdir -p css && \
    sass scss/main.scss css/main.css --style=compressed --no-source-map

# Stage 2: Aplicación Python
FROM python:3.12-slim
WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Copiar CSS compilado desde stage 1
COPY --from=scss-builder /build/css/ ./frontend/css/

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
