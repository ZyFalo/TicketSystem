## Why

Frontend (Antigravity) y backend (Claude Code) se desarrollaron por separado. Este cambio los integra: FastAPI sirve los archivos estáticos del frontend, SCSS se compila a CSS en el Dockerfile, y todo se despliega en Railway.

## What Changes

- Configurar FastAPI para servir archivos estáticos del frontend (HTML, CSS compilado, JS)
- Configurar rutas catch-all para servir las páginas HTML según la URL
- Agregar compilación SCSS→CSS con dart-sass en el Dockerfile
- Configurar variables de entorno para Railway (DATABASE_URL, SECRET_KEY)
- Deploy en Railway con docker-compose
- Crear README.md con instrucciones de setup y deploy

## Capabilities

### New Capabilities

- `deployment`: Configuración Docker completa con compilación SCSS, deploy Railway

### Modified Capabilities

- `infrastructure`: Dockerfile actualizado con dart-sass y compilación SCSS, rutas estáticas configuradas

## Impact

- **Código modificado:** backend/app/main.py (montar StaticFiles, rutas catch-all), Dockerfile (agregar dart-sass)
- **Código nuevo:** README.md
- **Infraestructura:** Configuración Railway, variables de entorno de producción
