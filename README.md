# API-Template

Este es un proyecto backend para un sistema de gestión de hogares inteligentes. Está construido con Node.js, TypeScript, Express y MongoDB.

## Tabla de Contenidos

- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Pruebas](#pruebas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Documentación de API](#documentación-de-api)
- [Contribución](#contribución)
- [Licencia](#licencia)

## Características

- Gestión de usuarios (crear, leer, actualizar, eliminar).
- Autenticación y autorización con JWT.
- Validación de datos con Joi.
- Conexión a MongoDB y Redis.
- Cobertura de pruebas con Jest.

## Requisitos Previos

- Node.js v22.14.0 (ver archivo `.nvmrc`).
- MongoDB y Redis instalados localmente o configurados en contenedores Docker.

## Instalación

1. Clona este repositorio:

   ```bash
   git clone https://github.com/tu-usuario/smart-home-backend.git
   cd smart-home-backend
   ```

2. Instala las dependencias:

   ```bash
   yarn install
   ```

3. Configura el entorno:
   Copia el archivo `.env.test` como `.env` y ajusta las variables según sea necesario.

## Configuración

El archivo `.env` contiene las siguientes variables:

```env
MONGO_URI=mongodb://localhost:27017/test
REDIS_URI=redis://localhost:6379
JWT_SECRET=tu_secreto
JWT_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=30d
```

## Ejecución

### Modo Desarrollo

```bash
yarn dev
```

### Modo Producción

```bash
yarn start
```

### Usando Docker

```bash
docker-compose up -d
```

## Pruebas

Ejecuta las pruebas con:

```bash
yarn test
```

## Estructura del Proyecto

```plaintext
src/
├── config/         # Configuración de la aplicación
├── controllers/    # Controladores de la API
├── DTOs/           # Data Transfer Objects
├── exceptions/     # Clases de excepciones personalizadas
├── handlers/       # Manejadores de respuestas y errores
├── helpers/        # Funciones auxiliares
├── middlewares/    # Middlewares de Express
├── models/         # Modelos de datos (Mongoose)
├── repositories/   # Repositorios para acceso a datos
├── routes/         # Definición de rutas
├── schemas/        # Validación de datos con Joi
├── services/       # Lógica de negocio
├── strategies/     # Estrategias de autenticación
├── utils/          # Utilidades generales
tests/
├── unit/           # Pruebas unitarias
├── utils/          # Utilidades para pruebas
```

## Documentación de API

### Endpoints Principales

#### Usuarios

- `GET /users`: Obtiene todos los usuarios.
- `GET /users/:id`: Obtiene un usuario por ID.
- `POST /users`: Crea un nuevo usuario.
- `PATCH /users/:id`: Actualiza un usuario.
- `DELETE /users/:id`: Elimina un usuario.

#### Autenticación

- `POST /auth/login`: Inicia sesión.
- `POST /auth/signup`: Registra un nuevo usuario.
- `GET /auth/info`: Obtiene información del usuario autenticado.
