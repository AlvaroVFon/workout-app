# Workout App API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

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
  <img alt="BullMQ" src="https://img.shields.io/badge/BullMQ-FF6B6B?logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJ6IiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==&logoColor=white&style=flat-square" />
  <img alt="Nodemailer" src="https://img.shields.io/badge/Nodemailer-0B3D91?logo=mailgun&logoColor=white&style=flat-square" />
  <img alt="Handlebars" src="https://img.shields.io/badge/Handlebars.js-f0772b?logo=handlebarsdotjs&logoColor=white&style=flat-square" />
</p>

API robusta para la gestión de atletas, entrenadores, ejercicios y sesiones de entrenamiento. Construida con Node.js, TypeScript, Express y MongoDB/Mongoose.

## Tabla de Contenidos

- [Descripción](#descripción)
- [Stack Tecnológico](#stack-tecnológico)
- [Características](#características)
- [Instalación y Configuración](#instalación-y-configuración)
- [Ejecución y Seeding](#ejecución-y-seeding)
- [Pruebas](#pruebas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Endpoints Principales](#endpoints-principales)
- [Seguridad y Autenticación](#seguridad-y-autenticación)
- [Email y Notificaciones](#email-y-notificaciones)
- [Sistema de Colas](#sistema-de-colas)
- [Contribución](#contribución)
- [Licencia](#licencia)

---

## Descripción

Backend para el seguimiento y análisis de progreso de atletas y entrenadores, con endpoints seguros, validaciones exhaustivas y consultas avanzadas.

## Stack Tecnológico

- Node.js 22+
- TypeScript
- Express.js
- MongoDB + Mongoose
- Joi (validación)
- JWT (autenticación)
- Redis (opcional, cache/sesiones)
- Jest (tests)
- Docker y docker-compose

## Características

- Autenticación robusta (JWT dual-token, refresh rotation)
- Gestión completa de atletas, ejercicios y sesiones
- Relaciones complejas y populate avanzado
- Validaciones estrictas con Joi y DTOs tipados
- Seguridad avanzada: roles, ownership, middlewares
- Consultas avanzadas: filtros, paginación, select
- Tests unitarios y e2e (>96% cobertura)
- Listo para producción: Docker, logging, error handling

## Instalación y Configuración

```bash
git clone https://github.com/tu-usuario/workout-app.git
cd workout-app
yarn install
cp .env.dist .env # y edita según tu entorno
```

Variables principales en `.env`:

- `NODE_ENV` — Entorno de ejecución (development, production)
- `MONGO_URI` — Cadena de conexión a MongoDB
- `REDIS_URI` — Cadena de conexión a Redis
- `JWT_SECRET` — Secreto para firmar JWT
- `JWT_EXPIRATION` — Duración del access token (ej: 30m)
- `JWT_REFRESH_EXPIRATION` — Duración del refresh token (ej: 7d)
- `SALT_ROUNDS` — Rondas de hash para contraseñas
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, `SMTP_FROM_NAME` — Configuración de email
- `LOG_LEVEL` — Nivel de logs (debug, info, warn, error)
- `MAX_LOGIN_ATTEMPTS`, `MAX_PASSWORD_RESET_ATTEMPTS`, `BLOCK_DURATION` — Seguridad de login/reset
- `CODE_LENGTH`, `CODE_RETRY_INTERVAL`, `CODE_EXPIRATION` — Configuración de códigos de recuperación
- `FRONTEND_URL` — URL del frontend permitido para CORS y emails

## Ejecución y Seeding

- **Desarrollo:** `yarn dev`
- **Producción:** `yarn start`
- **Docker:** `docker-compose up -d`
- **Seeding:** `yarn seed` o `npx ts-node src/seeders/index.seeder.ts`

## Pruebas

- **Todas:** `yarn test`
- **Unitarias:** `yarn test:unit`
- **E2E:** `yarn test:e2e`
- **Cobertura:** `yarn test:coverage`

## Estructura del Proyecto

```
src/
  config/         # Configuración
  controllers/    # Endpoints
  DTOs/           # Data Transfer Objects
  exceptions/     # Excepciones personalizadas
  factories/      # Factories para tests y seeders
  handlers/       # Respuesta y error
  helpers/        # Utilidades
  interfaces/     # Interfaces TS
  middlewares/    # Middlewares Express
  models/         # Modelos Mongoose
  repositories/   # Acceso a datos
  routes/         # Definición de rutas
  schemas/        # Validación Joi
  seeders/        # Poblar la base de datos
  services/       # Lógica de negocio
  strategies/     # Estrategias de autenticación
  templates/      # Plantillas de email
  types/          # Tipos globales
  utils/          # Utilidades generales
tests/
  config/
  e2e/            # Tests de integración
  unit/           # Tests unitarios
```

## Endpoints Principales

- `POST /auth/login` — Login (access y refresh token)
- `POST /auth/refresh` — Renovar tokens
- `GET /athletes` — Listar atletas
- `POST /athletes` — Crear atleta
- `PATCH /athletes/:id` — Actualizar atleta
- `PATCH /athletes/:id/disciplines` — Actualizar disciplinas del atleta
- `DELETE /athletes/:id` — Eliminar atleta
- ...y más para ejercicios, sesiones, usuarios

## Seguridad y Autenticación

- JWT dual-token (access/refresh) con rotación y gestión avanzada de sesiones
- El refresh token se entrega y valida mediante una cookie httpOnly segura (no accesible por JS)
- Roles y ownership
- Validaciones Joi en todos los endpoints
- Middleware de autenticación y autorización

## Email y Notificaciones

- Envío de emails con Nodemailer y plantillas Handlebars
- Mailhog para desarrollo (docker-compose)
- Ejemplo de uso en `src/services/mail.service.ts`

## Sistema de Colas

La aplicación incluye un **sistema de colas robusto** basado en BullMQ y Redis para el procesamiento asíncrono de tareas en segundo plano:

- ✅ **Procesamiento asíncrono** de emails y notificaciones
- ✅ **Dead Letter Queue (DLQ)** para manejo de fallos
- ✅ **Workers especializados** con reintentos automáticos
- ✅ **Sistema de eventos** para monitoreo del ciclo de vida
- ✅ **Persistencia** de trabajos fallidos en MongoDB
- ✅ **Escalabilidad** horizontal con múltiples workers

**📖 [Ver documentación completa del Sistema de Colas](./docs/QUEUE_SYSTEM.md)**

### Uso Básico

```typescript
import { enqueueEmailJob } from './queueSystem/jobs/email/email.job'
import { JobEnum } from './utils/enums/jobs/jobs.enum'
import { TemplateEnum } from './utils/enums/templates.enum'

// Agregar trabajo de email
await enqueueEmailJob({
  type: JobEnum.EMAIL,
  template: TemplateEnum.WELCOME,
  payload: { to: 'user@example.com', userName: 'Juan' },
})
```

## Testing

La aplicación cuenta con una suite completa de pruebas unitarias y de integración:

- **✅ 625 tests totales** (unitarios + e2e)
- **✅ Cobertura superior al 96%**
- **✅ Pruebas aisladas con mocks y factories**
- **✅ Tests e2e para flujos completos de autenticación y seguridad**

Para ejecutar los tests:

```bash
yarn test           # Todos los tests
yarn test:unit      # Solo unitarios
yarn test:e2e       # Solo end-to-end
yarn test:coverage  # Con cobertura
```

## Contribución

- Sigue la [Guía de Estilos](./STYLE_GUIDE.md)
- Revisa la [configuración recomendada de editor](./docs/EDITOR_SETUP.md)
- Pull requests y sugerencias bienvenidas

---

## Licencia

MIT
