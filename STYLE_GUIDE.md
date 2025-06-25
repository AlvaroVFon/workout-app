# 📋 Guía de Estilos - Workout API

> **Versión:** 1.0.0
> **Autor:** Álvaro Villamarín
> **Última actualización:** 25 de junio de 2025

Esta guía establece las convenciones de código, estructura y mejores prácticas para el desarrollo consistente del proyecto Workout API.

## 🎯 Tabla de Contenidos

- [1. Configuración del Entorno](#1-configuración-del-entorno)
- [2. Estructura del Proyecto](#2-estructura-del-proyecto)
- [3. Convenciones de Nomenclatura](#3-convenciones-de-nomenclatura)
- [4. Estilo de Código](#4-estilo-de-código)
- [5. Arquitectura y Patrones](#5-arquitectura-y-patrones)
- [6. TypeScript](#6-typescript)
- [7. Base de Datos](#7-base-de-datos)
- [8. Testing](#8-testing)
- [9. Git y Commits](#9-git-y-commits)
- [10. Documentación](#10-documentación)
- [11. Seguridad](#11-seguridad)
- [12. Performance](#12-performance)

---

## 1. Configuración del Entorno

### Herramientas Requeridas

- **Node.js:** 22.14.0 (versión específica)
- **Package Manager:** Yarn 1.22.22
- **Editor recomendado:** VS Code con extensiones

### Extensiones VS Code Recomendadas

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### Scripts NPM Estándar

```json
{
  "start": "ts-node index.ts",
  "dev": "nodemon index.ts",
  "test": "jest --runInBand --silent --verbose",
  "prettier": "prettier --check .",
  "prettier:fix": "prettier --write .",
  "lint": "eslint . --ext .ts",
  "lint:fix": "eslint . --ext .ts --fix",
  "seed": "ts-node src/seeders/index.seeder.ts"
}
```

---

## 2. Estructura del Proyecto

### Organización de Carpetas

```
src/
├── config/          # Configuraciones globales
├── controllers/     # Controladores de rutas
├── DTOs/           # Data Transfer Objects
├── exceptions/     # Excepciones personalizadas
├── factories/      # Factories para testing
├── handlers/       # Manejadores de respuestas/errores
├── helpers/        # Funciones de utilidad
├── interfaces/     # Interfaces TypeScript
├── middlewares/    # Middlewares Express
├── models/         # Modelos de Mongoose
├── repositories/   # Capa de acceso a datos
├── routes/         # Definición de rutas
├── schemas/        # Esquemas de validación
├── seeders/        # Seeders de base de datos
├── services/       # Lógica de negocio
├── strategies/     # Estrategias de autenticación
├── types/          # Tipos TypeScript globales
└── utils/          # Utilidades y enums
```

### Reglas de Estructura

- **Un archivo por clase/servicio/controlador**
- **Máximo 200 líneas por archivo** (excepción: tests)
- **Imports ordenados:** externos → internos → relativos
- **Exports por defecto** para clases principales

---

## 3. Convenciones de Nomenclatura

### Archivos y Carpetas

```typescript
// ✅ Correcto
user.controller.ts
user.service.ts
user.repository.ts
auth.middleware.ts
exercise.factory.ts

// ❌ Incorrecto
UserController.ts
userService.ts
AuthMiddleware.ts
```

### Variables y Funciones

```typescript
// ✅ Correcto - camelCase
const userName = 'john_doe'
const isValidEmail = true
const getUserById = async (id: string) => {}

// ❌ Incorrecto
const user_name = 'john_doe'
const IsValidEmail = true
const GetUserById = async (id: string) => {}
```

### Clases y Interfaces

```typescript
// ✅ Correcto - PascalCase
class UserService {}
interface UserInterface {}
class NotFoundException extends HttpException {}

// ❌ Incorrecto
class userService {}
interface userInterface {}
```

### Constantes y Enums

```typescript
// ✅ Correcto - UPPER_CASE para constantes globales
const DATABASE_URL = process.env.DATABASE_URL
const MAX_LOGIN_ATTEMPTS = 5

// ✅ Correcto - PascalCase para Enums
enum StatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
}
```

### DTOs y Modelos

```typescript
// ✅ Correcto - Sufijos descriptivos
CreateUserDTO
UpdateUserDTO
UserResponseDTO
User.ts (modelo)
user.schema.ts (esquema de validación)
```

---

## 4. Estilo de Código

### Configuración Prettier

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 120,
  "tabWidth": 2,
  "singleAttributePerLine": true
}
```

### Reglas de Formateo

```typescript
// ✅ Correcto - Destructuring
const { name, email, role } = req.body

// ✅ Correcto - Arrow functions para funciones cortas
const isAdmin = (user: UserDTO): boolean => user.role === 'admin'

// ✅ Correcto - Async/await sobre Promises
const user = await userService.findById(id)

// ✅ Correcto - Template literals
const message = `Usuario ${name} creado exitosamente`

// ✅ Correcto - Spread operator
const updatedUser = { ...existingUser, ...updateData }
```

### Imports y Exports

```typescript
// ✅ Correcto - Orden de imports
import { Request, Response, NextFunction } from 'express'
import userService from '../services/user.service'
import { responseHandler } from '../handlers/responseHandler'
import { StatusCode } from '../utils/enums/httpResponses.enum'
import NotFoundException from '../exceptions/NotFoundException'

// ✅ Correcto - Export por defecto para clases principales
class UserController {
  // ...
}

export default new UserController()
```

---

## 5. Arquitectura y Patrones

### Patrón de Capas

```
Controller → Service → Repository → Model
```

### Responsabilidades por Capa

```typescript
// CONTROLLER - Solo manejo de HTTP
class UserController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CreateUserDTO = req.body
      const user = await userService.create(data)
      return responseHandler(res, StatusCode.CREATED, StatusMessage.CREATED, user)
    } catch (error) {
      next(error)
    }
  }
}

// SERVICE - Lógica de negocio
class UserService {
  async create(data: CreateUserDTO): Promise<UserDTO> {
    const role = await roleService.findByName(data.role)
    if (!role) throw new NotFoundException(`Invalid role: ${data.role}`)

    data.password = await hashPassword(data.password)
    return userRepository.create(data)
  }
}

// REPOSITORY - Acceso a datos
class UserRepository {
  create(data: CreateUserDTO) {
    return User.create(data)
  }
}
```

### Inyección de Dependencias

```typescript
// ✅ Correcto - Importar servicios como singleton
import userRepository from '../repositories/user.repository'
import roleService from './role.service'

// ✅ Correcto - Export singleton
export default new UserService()
```

### Manejo de Errores

```typescript
// ✅ Correcto - Excepciones específicas
if (!user) throw new NotFoundException('User not found')
if (user.role !== 'admin') throw new ForbiddenException('Access denied')

// ✅ Correcto - Try-catch en controllers
try {
  const result = await service.operation()
  return responseHandler(res, StatusCode.OK, StatusMessage.OK, result)
} catch (error) {
  next(error) // Delegar al error handler
}
```

---

## 6. TypeScript

### Configuración Base

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Tipado Estricto

```typescript
// ✅ Correcto - Tipos explícitos
async findById(id: string): Promise<UserDTO | null> {
  return userRepository.findById(id)
}

// ✅ Correcto - Interfaces para objetos complejos
interface AuthenticatedRequest extends Request {
  user?: UserDTO
}

// ✅ Correcto - Generics para reutilización
interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
  timestamp: Date
}
```

### DTOs Obligatorios

```typescript
// ✅ Correcto - DTO para cada operación
export interface CreateUserDTO {
  name: string
  email: string
  password: string
  role: string
  idDocument: string
  lastName?: string
  country?: string
}

export interface UpdateUserDTO {
  name?: string
  lastName?: string
  country?: string
  address?: string
}
```

### Evitar `any`

```typescript
// ❌ Evitar
const data: any = req.body

// ✅ Correcto
const data: CreateUserDTO = req.body

// ✅ Alternativa para casos complejos
const data: Record<string, unknown> = req.body
```

---

## 7. Base de Datos

### Convenciones MongoDB/Mongoose

```typescript
// ✅ Correcto - Schema definition
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: Types.ObjectId,
      ref: 'Role',
      required: true,
    },
  },
  {
    collection: 'users',
    timestamps: true,
  },
)
```

### Nombrado de Colecciones

- **Plural en inglés:** `users`, `exercises`, `training_sessions`
- **snake_case para nombres compuestos**
- **Consistencia en el idioma** (inglés)

### Queries Optimizadas

```typescript
// ✅ Correcto - Projection y lean queries
async findAll({ query = {}, projection = {}, options = {} }: ModelQuery<UserDTO> = {}) {
  return User.find(query, projection, options).lean()
}

// ✅ Correcto - Populate específico
async findWithRole(id: string) {
  return User.findById(id).populate('role', 'name description')
}
```

---

## 8. Testing

### Estructura de Tests

```
tests/
├── unit/           # Tests unitarios
│   ├── services/
│   ├── repositories/
│   └── utils/
├── integration/    # Tests de integración
└── utils/          # Utilidades para testing
```

### Convenciones de Testing

```typescript
// ✅ Correcto - Describe anidados
describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should hash the password and create a user', async () => {
      // Arrange
      const mockData: CreateUserDTO = {
        email: 'test@example.com',
        password: 'plainPassword',
        name: 'Test User',
        role: 'admin',
        idDocument: '123456789',
      }

      // Act
      const result = await userService.create(mockData)

      // Assert
      expect(hashPassword).toHaveBeenCalledWith('plainPassword')
      expect(result).toBeDefined()
    })
  })
})
```

### Factories para Testing

```typescript
// ✅ Correcto - Factory pattern
export const userFactory = {
  build: (overrides: Partial<CreateUserDTO> = {}): CreateUserDTO => ({
    name: faker.person.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: 'user',
    idDocument: faker.string.numeric(9),
    ...overrides,
  }),
}
```

### Cobertura Requerida

- **Mínimo 80%** de cobertura general
- **90%+ en services** (lógica crítica)
- **70%+ en controllers** (manejo de errores)

---

## 9. Git y Commits

### Conventional Commits

```bash
# ✅ Correcto
feat: add user authentication endpoint
fix: resolve password hashing issue
docs: update API documentation
test: add user service unit tests
refactor: improve error handling structure

# ❌ Incorrecto
Added login
Fixed bug
Updated code
```

### Tipos de Commit Permitidos

- `feat`: Nueva funcionalidad
- `fix`: Corrección de errores
- `docs`: Documentación
- `style`: Cambios de formato
- `refactor`: Refactorización
- `test`: Tests
- `chore`: Tareas de mantenimiento
- `perf`: Mejoras de rendimiento
- `ci`: Cambios en CI/CD

### Branch Naming

```bash
# ✅ Correcto
feature/user-authentication
fix/password-validation
docs/api-endpoints
hotfix/security-patch

# ❌ Incorrecto
login-feature
bug-fix
documentation
```

### Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{ts,js}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

---

## 10. Seguridad

### Validación de Entrada

```typescript
// ✅ Correcto - Validación con Joi/Zod
const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
})

// ✅ Correcto - Sanitización
const sanitizedInput = validator.escape(req.body.name)
```

### Autenticación y Autorización

```typescript
// ✅ Correcto - JWT con expiración
const token = jwt.sign(payload, secret, { expiresIn: '24h' })

// ✅ Correcto - Middleware de autorización
const authorizeRoles = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role)) {
      throw new ForbiddenException('Access denied')
    }
    next()
  }
}
```

### Variables de Entorno

```typescript
// ✅ Correcto - Validación de env vars
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'PORT']
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
})
```

---

## 11. Performance

### Queries Eficientes

```typescript
// ✅ Correcto - Pagination
async findAll(options: PaginationOptions) {
  const { page = 1, limit = 10 } = options
  const skip = (page - 1) * limit

  return User.find({})
    .limit(limit)
    .skip(skip)
    .lean()
}

// ✅ Correcto - Indices en MongoDB
userSchema.index({ email: 1 })
userSchema.index({ role: 1, createdAt: -1 })
```

### Caching Estratégico

```typescript
// ✅ Correcto - Cache para datos frecuentes
async findByEmail(email: string): Promise<UserDTO | null> {
  const cacheKey = `user:email:${email}`
  const cached = await redis.get(cacheKey)

  if (cached) return JSON.parse(cached)

  const user = await User.findOne({ email }).lean()
  if (user) await redis.setex(cacheKey, 300, JSON.stringify(user))

  return user
}
```

### Lazy Loading

```typescript
// ✅ Correcto - Solo cargar cuando sea necesario
async findWithDetails(id: string, includeRole = false) {
  const query = User.findById(id)

  if (includeRole) {
    query.populate('role', 'name description')
  }

  return query.lean()
}
```

---

## 🚀 Checklist para Pull Requests

Antes de crear un PR, verificar:

- [ ] **Código formateado** con Prettier
- [ ] **Sin errores de ESLint**
- [ ] **Tests unitarios** agregados/actualizados
- [ ] **Cobertura de tests** mantenida
- [ ] **Documentación** actualizada
- [ ] **Commits** siguen Conventional Commits
- [ ] **Variables de entorno** documentadas
- [ ] **Migraciones** incluidas (si aplica)
- [ ] **Breaking changes** documentados

---

## 📞 Contacto y Dudas

Para dudas sobre esta guía o sugerencias de mejora:

- **Mantainer:** Álvaro Villamarín
- **Issues:** Crear issue en el repositorio
- **Discussions:** Usar GitHub Discussions para propuestas

---

_Esta guía es un documento vivo y debe actualizarse conforme evoluciona el proyecto._
