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
- [Database Seeding](#database-seeding)
- [Pruebas](#pruebas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Endpoints Principales](#endpoints-principales)
- [Consultas Avanzadas](#consultas-avanzadas)
- [Seguridad](#seguridad)
- [Contribución](#contribución)
- [Licencia](#licencia)
- [Documentación para Desarrolladores](#documentación-para-desarrolladores)

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

- **Autenticación robusta**: Sistema dual-token JWT con refresh automático y rotación de sesiones
- **Gestión completa** de atletas, ejercicios y sesiones de entrenamiento
- **Relaciones complejas** entre recursos (populate avanzado)
- **Validaciones estrictas** con Joi y DTOs tipados
- **Seguridad avanzada**: JWT, roles, ownership y middlewares
- **Consultas avanzadas**: populate, select, filtros, paginación
- **Tests comprehensivos**: 456+ tests unitarios y e2e con >97% cobertura
- **Listo para producción**: Docker, logging, error handling

## 🔐 Sistema de Autenticación y Refresh Tokens

La aplicación implementa un sistema de autenticación robusto con **refresh token rotation** y gestión avanzada de sesiones.

### Características de Seguridad

- **Dual-token system**: Access tokens de corta duración (15m) + Refresh tokens de larga duración (7d)
- **Token rotation**: Los refresh tokens se regeneran en cada uso, invalidando los anteriores
- **Session management**: Control completo de sesiones activas con TTL automático
- **Type validation**: Validación estricta de tipos de token (access vs refresh)
- **Automatic cleanup**: Sesiones expiradas se eliminan automáticamente de la base de datos

### Flujo de Autenticación

1. **Login**: Usuario se autentica y recibe access token + refresh token
2. **Requests**: Access token se usa para requests autenticados
3. **Refresh**: Cuando el access token expira, se usa el refresh token para obtener nuevos tokens
4. **Rotation**: El refresh token anterior se invalida y se genera uno nuevo
5. **Cleanup**: Las sesiones expiradas se eliminan automáticamente

### Endpoints de Autenticación

```typescript
// Login - Obtener tokens iniciales
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
Response: {
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIs...", // Access token
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..." // Refresh token
  }
}

// Refresh - Obtener nuevos tokens
POST /api/auth/refresh
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
Response: {
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...", // Nuevo access token
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..." // Nuevo refresh token
  }
}
```

### Configuración de Seguridad

Las duraciones de los tokens se configuran mediante variables de entorno:

```env
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRATION=15m          # Access token (recomendado: 15m-1h)
JWT_REFRESH_EXPIRATION=7d   # Refresh token (recomendado: 7d-30d)
```

### Gestión de Sesiones

- **Sesiones activas**: Solo una sesión activa por usuario
- **Invalidación automática**: Sesiones anteriores se marcan como expiradas
- **TTL Index**: MongoDB elimina automáticamente sesiones expiradas
- **Seguridad mejorada**: Tokens hasheados en base de datos

### Casos de Uso Avanzados

```typescript
// Verificar información del usuario autenticado
GET / api / auth / info
Headers: {
  Authorization: 'Bearer access_token'
}

// Los refresh tokens NO pueden usarse para endpoints protegidos
GET / api / users
Headers: {
  Authorization: 'Bearer refresh_token'
} // ❌ Error 401

// Solo access tokens son válidos para endpoints protegidos
GET / api / users
Headers: {
  Authorization: 'Bearer access_token'
} // ✅ OK
```

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
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
```

### Variables de Entorno JWT

- **`JWT_SECRET`**: Clave secreta para firmar tokens (usar una clave fuerte en producción)
- **`JWT_EXPIRATION`**: Duración del access token (por defecto: 15m)
- **`JWT_REFRESH_EXPIRATION`**: Duración del refresh token (por defecto: 7d)

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

## Database Seeding

La aplicación incluye un sistema completo de seeding para poblar la base de datos con datos de prueba.

### 🌱 Ejecutar Seeding Completo

```bash
# Ejecutar todos los seeders
yarn seed

# O usando ts-node directamente
npx ts-node src/seeders/index.seeder.ts
```

### 📊 Datos Generados

El seeding crea automáticamente:

- **2 Usuarios Admin** (SuperAdmin + Admin)
- **20 Usuarios regulares** (entrenadores)
- **Todos los músculos** (basados en `MusclesEnum`)
- **Todos los roles** (basados en `RolesEnum`)
- **21 Ejercicios variados** con músculos asignados
- **10 Atletas** con datos realistas
- **10 Sesiones de entrenamiento** completas

### 🏭 Factories Disponibles

Los factories utilizan **Faker.js** para generar datos realistas:

```typescript
// Atletas con datos coherentes
createAthlete(db, customData?)
createAthletes(quantity, db)

// Ejercicios con músculos aleatorios
createExercise(customData?)

// Sesiones de entrenamiento completas
createTrainingSession(db, customData?)
createTrainingSessions(quantity, db)

// Usuarios con roles específicos
createUsers(quantity)
createAdminUser()
createSuperAdminUser()
```

### ⚙️ Configuración de Seeding

Puedes personalizar las cantidades en [`src/seeders/index.seeder.ts`](src/seeders/index.seeder.ts):

```typescript
await seedAthletes(db, 10) // 10 atletas
await seedTrainingSessions(db, 10) // 10 sesiones
```

### 🗂️ Seeders Individuales

También puedes ejecutar seeders específicos:

```typescript
import { seedAthletes } from './seeders/athlete.seeder'
import { seedExercises } from './seeders/exercise.seeder'
// ... otros seeders
```

### 🔄 Comportamiento de Seeding

- **Drop & Create**: Cada seeder elimina la colección existente antes de crear nuevos datos
- **Relaciones**: Los seeders manejan automáticamente las relaciones (atleta ↔ coach, ejercicio ↔ músculos)
- **Datos coherentes**: Los factories generan datos que respetan las validaciones del schema
- **Error handling**: Logging completo de errores durante el proceso

## Pruebas

La aplicación cuenta con una suite completa de pruebas unitarias y de integración con **cobertura del 96%**:

### Ejecutar Todas las Pruebas

```bash
yarn test
```

### Ejecutar por Tipo

```bash
# Solo pruebas unitarias
yarn test:unit

# Solo pruebas end-to-end
yarn test:e2e

# Con cobertura
yarn test:coverage
```

### Estado Actual de las Pruebas ✅

- **✅ 456 tests totales** (443 unitarios + 13 e2e) - **TODOS PASANDO**
- **✅ Cobertura del 96.35%** en líneas de código
- **✅ Pruebas aisladas** con mocks y factories
- **✅ Tests e2e** para flujos completos de autenticación y refresh tokens
- **✅ Tests de seguridad** para validación de tipos de token
- **✅ Tests de rotación** de refresh tokens y gestión de sesiones

### Arquitectura de Testing

#### Pruebas Unitarias (`tests/unit/`)

- **Controllers**: Lógica de endpoints y manejo de errores
- **Services**: Lógica de negocio y validaciones
- **Repositories**: Acceso a datos y consultas
- **Middlewares**: Validación y autorización
- **Utils**: Funciones auxiliares (JWT, password hashing)
- **Schemas**: Validación Joi
- **Models**: Validación de esquemas Mongoose

#### Pruebas E2E (`tests/e2e/`)

- **Auth Flow**: Login, signup, refresh de tokens, info de usuario
- **Token Validation**: Casos edge, tokens malformados, expirados
- **Protected Routes**: Verificación de autorización
- **Error Handling**: Respuestas de error consistentes

#### Herramientas de Testing

- **Jest**: Framework principal con mocks y spies
- **Supertest**: Pruebas HTTP para endpoints
- **MongoDB Memory Server**: Base de datos en memoria para tests
- **Factories**: Generación de datos de prueba consistentes
- **Test Isolation**: Cada test es independiente y aislado

### Ejemplos de Pruebas

#### Test Unitario (JWT Utils)

```typescript
describe('JWT Utils', () => {
  it('should verify refresh token type correctly', () => {
    const payload = { userId: '123', role: 'user', type: 'refresh' }
    const token = generateRefreshToken(payload)
    const decoded = verifyRefreshToken(token)

    expect(decoded).toMatchObject(payload)
  })
})
```

#### Test E2E (Auth Flow)

```typescript
describe('POST /auth/refresh', () => {
  it('should refresh tokens successfully', async () => {
    const { refreshToken } = await loginUser()

    const response = await request(app).post('/auth/refresh').send({ refreshToken }).expect(200)

    expect(response.body.data).toHaveProperty('accessToken')
    expect(response.body.data).toHaveProperty('refreshToken')
  })
})
```

Cobertura disponible en `/coverage` tras ejecutar los tests.

## Estructura del Proyecto

```plaintext
src/
├── config/         # Configuración (DB, middleware, passport)
├── controllers/    # Lógica de endpoints (auth, athletes, etc.)
├── DTOs/           # Data Transfer Objects (tipado)
├── exceptions/     # Excepciones personalizadas
├── handlers/       # Manejadores de respuesta y error
├── middlewares/    # Middlewares de Express (auth, validation)
├── models/         # Modelos Mongoose (User, Athlete, etc.)
├── repositories/   # Acceso a datos y consultas avanzadas
├── routes/         # Definición de rutas (auth, athletes, etc.)
├── schemas/        # Validación Joi (auth, create/update schemas)
├── services/       # Lógica de negocio (auth, user management)
├── strategies/     # Estrategias de autenticación (JWT strategy)
├── utils/          # Utilidades (JWT utils, password helpers)
└── tests/          # Pruebas unitarias y e2e
    ├── unit/       # Tests unitarios por módulo
    ├── e2e/        # Tests de integración completos
    └── utils/      # Helpers para testing
```

### Componentes Clave de Autenticación

- **`src/utils/jwt.utils.ts`** - Generación y verificación de tokens
- **`src/strategies/jwt.strategy.ts`** - Estrategia Passport para JWT
- **`src/middlewares/auth.middleware.ts`** - Middleware de autenticación
- **`src/controllers/auth.controller.ts`** - Endpoints de autenticación
- **`src/services/auth.service.ts`** - Lógica de negocio de auth

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

- `POST /auth/login` — Login (devuelve access token y refresh token)
- `POST /auth/signup` — Registro
- `POST /auth/refresh` — Renovar tokens usando refresh token
- `GET /auth/info` — Información del usuario autenticado

## Consultas Avanzadas

- **Populate:** Puedes solicitar recursos relacionados (athlete, exercises) usando populate desde el frontend o configurando el repositorio.
- **Select:** Limita los campos devueltos usando projection/select.
- **Filtros:** Filtra por fecha, tipo, atleta, etc. usando query params.
- **Paginación:** Incluida en endpoints de listado.

## Seguridad

- **JWT Dual-Token System**: Access tokens (corta duración) y refresh tokens (larga duración) con rotación automática
- **Session Management**: Gestión avanzada de sesiones con invalidación automática y TTL cleanup
- **Token Type Validation**: Los tokens incluyen un campo `type` para prevenir su mal uso
- **Refresh Token Rotation**: Los refresh tokens se regeneran en cada uso, invalidando los anteriores
- **Roles** (admin, superadmin, user) con autorización granular
- **Ownership**: los usuarios solo acceden a sus propios recursos
- **Validaciones Joi** en todos los endpoints
- **Middleware de Autenticación**: JWT strategy con Passport.js

### Arquitectura JWT Avanzada

El sistema implementa un patrón de doble token con rotación para máxima seguridad:

1. **Access Token**:

   - Duración corta (por defecto 15 minutos)
   - Usado para autenticación en endpoints protegidos
   - Incluye información del usuario y rol
   - Tipo: `"access"`

2. **Refresh Token**:

   - Duración larga (por defecto 7 días)
   - Usado únicamente para renovar tokens
   - No válido para endpoints protegidos
   - Tipo: `"refresh"`
   - **Rotación automática**: Se regenera en cada uso

3. **Session Management**:

   - Solo una sesión activa por usuario
   - Sesiones anteriores se invalidan automáticamente
   - TTL index elimina sesiones expiradas de MongoDB
   - Refresh tokens hasheados en base de datos

4. **Flujo de Renovación con Rotación**:

   ```bash
   POST /auth/refresh
   Content-Type: application/json

   {
     "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   }
   ```

   **Respuesta:**

   ```json
   {
     "data": {
       "token": "nuevo_access_token...",
       "refreshToken": "nuevo_refresh_token..." // ⚠️ Token anterior invalidado
     }
   }
   ```

### Beneficios de Seguridad

- **Mitigación de token hijacking**: Los refresh tokens robados tienen vida útil limitada
- **Detección de ataques**: El uso de refresh tokens invalidados alerta sobre posibles ataques
- **Cleanup automático**: Las sesiones expiradas se eliminan sin intervención manual
- **Reducción de superficie de ataque**: Access tokens de corta duración minimizan la exposición

  Respuesta:

  ```json
  {
    "status": "success",
    "data": {
      "accessToken": "nuevo_access_token",
      "refreshToken": "nuevo_refresh_token"
    }
  }
  ```

## Ejemplo de Uso (cURL)

### Autenticación Completa

```bash
# 1. Login inicial
curl -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "admin@workout.com",
    "password": "admin123"
  }'

# Respuesta:
# {
#   "status": "success",
#   "data": {
#     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#     "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
#   }
# }

# 2. Usar access token en endpoints protegidos
curl -X GET http://localhost:3000/auth/info \
  -H 'Authorization: Bearer <accessToken>'

# 3. Renovar tokens cuando expiren
curl -X POST http://localhost:3000/auth/refresh \
  -H 'Content-Type: application/json' \
  -d '{
    "refreshToken": "<refreshToken>"
  }'

# 4. Crear sesión de entrenamiento
curl -X POST http://localhost:3000/training-sessions \
  -H 'Authorization: Bearer <accessToken>' \
  -H 'Content-Type: application/json' \
  -d '{
    "athlete": "<athleteId>",
    "exercises": [{ "exercise": "<exerciseId>", "sets": [{ "reps": 10 }] }]
  }'
```

### Casos de Error Comunes

```bash
# Token expirado (401)
curl -X GET http://localhost:3000/auth/info \
  -H 'Authorization: Bearer <expiredToken>'

# Refresh token inválido (401)
curl -X POST http://localhost:3000/auth/refresh \
  -H 'Content-Type: application/json' \
  -d '{ "refreshToken": "invalid_token" }'

# Usar refresh token en endpoint protegido (401)
curl -X GET http://localhost:3000/auth/info \
  -H 'Authorization: Bearer <refreshToken>'
```

---

## 📚 Documentación para Desarrolladores

### Para Nuevos Desarrolladores

- **[📋 Guía de Estilos](./STYLE_GUIDE.md)** - Convenciones de código y mejores prácticas
- **[⚙️ Configuración de Editor](./docs/EDITOR_SETUP.md)** - Setup para VS Code, WebStorm, etc.

---
