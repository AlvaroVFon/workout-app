# Workout App API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

<!-- Stack Badges -->
<p align="left">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=flat-square" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square" />
  <img alt="Express" src="https://img.shields.io/badge/Express-000000?logo=express&logoColor=white&style=flat-square" />
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white&style=flat-square" />
  <img alt="Mongoose" src="https://img.shields.io/badge/Mongoose-880000?logo=mongoose&logoColor=white&style=flat-square" />
  <img alt="Joi" src="https://img.shields.io/badge/Joi-00B4AB?logo=data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMDBCNEFCIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDE4Yy00LjQxIDAtOC0zLjU5LTgtOHMzLjU5LTggOC04IDggMy41OSA4IDgtMy41OSA4LTggOHoiLz48L3N2Zz4=&logoColor=white&style=flat-square" />
  <img alt="JWT" src="https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white&style=flat-square" />
  <img alt="Redis" src="https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white&style=flat-square" />
  <img alt="Jest" src="https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white&style=flat-square" />
  <img alt="Docker" src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white&style=flat-square" />
</p>

> **API robusta para el seguimiento de atletas y entrenadores, diseñada con Node.js, TypeScript, Express y MongoDB/Mongoose.**

---

## Tabla de Contenidos

- [Descripción](#descripción)
- [Stack Tecnológico](#stack-tecnológico)
- [Características](#características)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Pruebas](#pruebas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Endpoints Principales](#endpoints-principales)
- [Consultas Avanzadas](#consultas-avanzadas)
- [Seguridad](#seguridad)
- [Contribución](#contribución)
- [Licencia](#licencia)

---

## Descripción

API backend para la gestión de atletas, entrenadores, ejercicios y sesiones de entrenamiento. Permite el registro, seguimiento y análisis de progreso, con endpoints seguros, validaciones exhaustivas y consultas avanzadas (populate, select, filtros).

## Stack Tecnológico

- **Node.js** 22+
- **TypeScript**
- **Express.js**
- **MongoDB** + **Mongoose**
- **Joi** (validación de datos)
- **JWT** (autenticación)
- **Redis** (opcional, para cache y sesiones)
- **Jest** (tests unitarios)
- **Docker** y **docker-compose** (desarrollo y despliegue)

## Características

- Gestión completa de atletas, ejercicios y sesiones de entrenamiento
- Relaciones entre recursos (populate avanzado)
- Validaciones estrictas con Joi y DTOs tipados
- Seguridad: JWT, roles, ownership y middlewares
- Consultas avanzadas: populate, select, filtros, paginación
- Virtuals y cálculos automáticos (por ejemplo, caloriesBurned)
- Tests unitarios y cobertura
- Listo para integración con frontend (MVP)

## Instalación

```bash
git clone https://github.com/tu-usuario/workout-app.git
cd workout-app
yarn install
```

## Configuración

1. Copia `.env.example` a `.env` y ajusta las variables:

```env
MONGO_URI=mongodb://localhost:27017/workout
REDIS_URI=redis://localhost:6379
JWT_SECRET=supersecret
JWT_EXPIRATION=1h
```

2. (Opcional) Usa Docker:

```bash
docker-compose up -d
```

## Ejecución

- **Desarrollo:**
  ```bash
  yarn dev
  ```
- **Producción:**
  ```bash
  yarn start
  ```

## Pruebas

```bash
yarn test
```

Cobertura disponible en `/coverage` tras ejecutar los tests.

## Estructura del Proyecto

```plaintext
src/
├── config/         # Configuración
├── controllers/    # Lógica de endpoints
├── DTOs/           # Data Transfer Objects
├── exceptions/     # Excepciones personalizadas
├── handlers/       # Manejadores de respuesta y error
├── middlewares/    # Middlewares de Express
├── models/         # Modelos Mongoose
├── repositories/   # Acceso a datos y consultas avanzadas
├── routes/         # Definición de rutas
├── schemas/        # Validación Joi
├── services/       # Lógica de negocio
├── strategies/     # Estrategias de autenticación
├── utils/          # Utilidades generales
└── tests/          # Pruebas unitarias
```

## Endpoints Principales

### Atletas

- `GET /athletes` — Listar atletas
- `GET /athletes/:id` — Detalle de atleta
- `POST /athletes` — Crear atleta
- `PATCH /athletes/:id` — Actualizar atleta
- `DELETE /athletes/:id` — Eliminar atleta

### Ejercicios

- `GET /exercises` — Listar ejercicios
- `POST /exercises` — Crear ejercicio

### Sesiones de Entrenamiento

- `GET /training-sessions/athlete/:id` — Listar sesiones por atleta (paginado)
- `GET /training-sessions/:id` — Detalle de sesión (populate avanzado)
- `POST /training-sessions` — Crear sesión

### Autenticación

- `POST /auth/login` — Login
- `POST /auth/signup` — Registro

## Consultas Avanzadas

- **Populate:** Puedes solicitar recursos relacionados (athlete, exercises) usando populate desde el frontend o configurando el repositorio.
- **Select:** Limita los campos devueltos usando projection/select.
- **Filtros:** Filtra por fecha, tipo, atleta, etc. usando query params.
- **Paginación:** Incluida en endpoints de listado.

## Seguridad

- **JWT** para autenticación
- **Roles** (admin, superadmin, user)
- **Ownership**: los usuarios solo acceden a sus propios recursos
- **Validaciones Joi** en todos los endpoints

## Ejemplo de Uso (cURL)

```bash
# Crear sesión de entrenamiento
curl -X POST http://localhost:3000/training-sessions \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "athlete": "<athleteId>",
    "exercises": [{ "exercise": "<exerciseId>", "sets": [{ "reps": 10 }] }]
  }'
```
