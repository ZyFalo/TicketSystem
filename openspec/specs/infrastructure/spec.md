# infrastructure Specification

## Purpose
Define la infraestructura del proyecto: Docker, base de datos, modelos ORM, migraciones y configuración por entorno.

## Requirements

### Requirement: Docker compose funcional
El proyecto SHALL incluir docker-compose.yml con servicios app (FastAPI) y db (PostgreSQL) que levanten con un solo comando.

#### Scenario: Levantar entorno completo
- **WHEN** un desarrollador ejecuta docker-compose up
- **THEN** FastAPI arranca en puerto 8000, PostgreSQL en 5432, y /docs es accesible

### Requirement: Modelos SQLModel completos
El proyecto SHALL definir modelos SQLModel para Usuario, Ticket y Observacion con todos los campos del dominio y relaciones FK.

#### Scenario: Modelos reflejan el dominio
- **WHEN** se inspeccionan los modelos en models.py
- **THEN** contienen todos los campos definidos en la especificación (ID, título, descripción, categoría, prioridad, estado, fechas, fragmento de código, lenguaje, resolución, observaciones, usuario creador, usuario asignado)

### Requirement: Migraciones Alembic
El proyecto SHALL usar Alembic para gestionar migraciones de base de datos.

#### Scenario: Migración inicial crea tablas
- **WHEN** se ejecuta alembic upgrade head
- **THEN** se crean las tablas usuarios, tickets y observaciones en PostgreSQL

### Requirement: Configuración por variables de entorno
El proyecto SHALL usar Pydantic Settings para leer DATABASE_URL y SECRET_KEY desde variables de entorno con valores por defecto para desarrollo local.

#### Scenario: Configuración con defaults
- **WHEN** no se definen variables de entorno
- **THEN** la app usa valores por defecto que apuntan al PostgreSQL del docker-compose
