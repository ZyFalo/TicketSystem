# deployment Specification

## Purpose
Define la integración frontend+backend, compilación SCSS, Docker y deploy en Railway.

## Requirements

### Requirement: FastAPI sirve archivos estáticos del frontend
FastAPI SHALL montar el directorio frontend como StaticFiles y definir rutas que retornen los archivos HTML correspondientes.

#### Scenario: Acceso a página de inicio
- **WHEN** un usuario accede a /
- **THEN** FastAPI retorna frontend/html/index.html

#### Scenario: Acceso a archivos estáticos
- **WHEN** el navegador solicita /static/css/main.css o /static/js/api.js
- **THEN** FastAPI retorna el archivo correspondiente del directorio frontend

### Requirement: Compilación SCSS en Docker
El Dockerfile SHALL compilar SCSS a CSS comprimido durante el build usando dart-sass.

#### Scenario: Build genera CSS
- **WHEN** se ejecuta docker build
- **THEN** el archivo frontend/css/main.css existe y contiene el CSS compilado y comprimido

### Requirement: Docker compose levanta todo
Un solo comando docker-compose up SHALL levantar FastAPI + PostgreSQL con el frontend integrado y funcional.

#### Scenario: Sistema completo funcional
- **WHEN** se ejecuta docker-compose up
- **THEN** el sistema es accesible en localhost:8000, las páginas cargan, la API responde, y la base de datos persiste datos

### Requirement: Deploy en Railway
El proyecto SHALL deployarse en Railway usando el Dockerfile existente con variables de entorno DATABASE_URL y SECRET_KEY configuradas.

#### Scenario: Deploy exitoso
- **WHEN** se conecta el repositorio a Railway y se configuran las variables de entorno
- **THEN** la aplicación es accesible en la URL pública de Railway con todas las funcionalidades operativas
