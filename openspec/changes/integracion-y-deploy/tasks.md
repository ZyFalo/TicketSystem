## 1. Servir frontend desde FastAPI

- [x] 1.1 Configurar StaticFiles en backend/app/main.py para montar frontend/ como /static
- [x] 1.2 Crear rutas FileResponse para cada página: / → index.html, /login → login.html, /crear → crear.html, /tickets → tickets.html, /ticket/{id} → detalle.html
- [x] 1.3 Verificar que las páginas cargan correctamente y los assets (CSS, JS) se sirven

## 2. Compilación SCSS en Docker

- [x] 2.1 Actualizar Dockerfile: instalar sass via npm, compilar SCSS a CSS comprimido
- [x] 2.2 Crear directorio frontend/css/ como destino de compilación
- [x] 2.3 Verificar que docker build genera frontend/css/main.css correcto

## 3. Integración end-to-end

- [x] 3.1 Probar flujo completo en docker-compose: register → login → crear ticket → ver listado → filtrar → agregar observación → resolver → cerrar
- [x] 3.2 Verificar que highlight.js funciona en tickets con código
- [x] 3.3 Verificar que la navegación entre páginas funciona correctamente
- [x] 3.4 Verificar que /docs (Swagger UI) sigue accesible

## 4. Deploy Railway

- [ ] 4.1 Configurar variables de entorno en Railway: DATABASE_URL (PostgreSQL addon), SECRET_KEY
- [ ] 4.2 Deploy y verificar que la aplicación funciona en la URL pública
- [x] 4.3 Crear README.md con instrucciones de setup local (docker-compose up) y deploy (Railway)
