# Sistema de Colas (Queue System)

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Arquitectura](#arquitectura)
- [Componentes Principales](#componentes-principales)
- [Configuración](#configuración)
- [Tipos de Trabajos (Jobs)](#tipos-de-trabajos-jobs)
- [Dead Letter Queue (DLQ)](#dead-letter-queue-dlq)
- [Workers y Procesamiento](#workers-y-procesamiento)
- [Eventos del Sistema](#eventos-del-sistema)
- [Uso Práctico](#uso-práctico)
- [Monitoreo y Debugging](#monitoreo-y-debugging)
- [Testing](#testing)

---

## Descripción General

El sistema de colas de la aplicación Workout App proporciona una infraestructura robusta para el procesamiento asíncrono de tareas en segundo plano. Está construido sobre **BullMQ** y Redis, ofreciendo características empresariales como:

- ✅ **Procesamiento asíncrono** de trabajos pesados
- ✅ **Dead Letter Queue (DLQ)** para manejo de fallos
- ✅ **Sistema de eventos** para lifecycle de trabajos
- ✅ **Reintento automático** de trabajos fallidos
- ✅ **Persistencia** de trabajos en MongoDB
- ✅ **Escalabilidad** horizontal con múltiples workers

## Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Application   │    │   Queue System  │    │     Workers     │
│                 │───▶│                 │───▶│                 │
│  - Controllers  │    │  - QueueService │    │ - EmailWorker   │
│  - Services     │    │  - JobHandlers  │    │ - DLQWorker     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │      Redis      │
                       │   (Job Queue)   │
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │    MongoDB      │
                       │ (DeadLetter)    │
                       └─────────────────┘
```

## Componentes Principales

### 1. **QueueService** (`src/queueSystem/queue.service.ts`)

Servicio principal para agregar trabajos a las colas:

```typescript
import queueService from './queueSystem/queue.service'
import { QueueName } from './queueSystem/utils/queue.enum'

// Agregar un trabajo directamente (uso interno)
await queueService.addJob(QueueName.DEFAULT, emailJobData)

// Para emails, se recomienda usar el wrapper:
import { enqueueEmailJob } from './queueSystem/jobs/email/email.job'
await enqueueEmailJob(emailJobData)
```

### 2. **Queue Registry** (`src/queueSystem/queues/`)

Registro centralizado de todas las colas disponibles:

- **Default Queue**: Para trabajos generales (emails, notificaciones)
- **Dead Letter Queue**: Para trabajos fallidos que requieren atención manual

### 3. **Workers** (`src/queueSystem/workers/`)

Procesadores que ejecutan los trabajos:

- **EmailWorker**: Procesa envío de emails
- **DeadLetterWorker**: Maneja trabajos fallidos

### 4. **Job Handlers** (`src/queueSystem/jobs/`)

Lógica específica para cada tipo de trabajo:

- **Email Handler**: Integración con Nodemailer usando templates específicos
- **Dead Letter Handler**: Persistencia en MongoDB

## Configuración

### Variables de Entorno

```bash
# Redis (requerido para BullMQ)
REDIS_URI=redis://localhost:6379

# Configuración general (no específicas de queue aún)
# Las configuraciones específicas de queue se pueden agregar en el futuro
```

### Inicialización

El sistema se inicializa automáticamente en el bootstrap de la aplicación:

```typescript
// src/queueSystem/workers/bootstrap.ts
import { connectDatabase } from '../../config/db'
import logger from '../../utils/logger'
import { attachWorkerEvents } from '../events/workers/workerEvents.attacher'
import { WorkerEnum } from '../utils/workers.enum'
import { createWorker } from './shared/worker.factory'
import { workersRegistry } from './shared/worker.registry'

async function bootstrap() {
  await connectDatabase()
  for (const workerType of workers) {
    try {
      const createdWorker = createWorker(workerType)
      await attachWorkerEvents(workerType, createdWorker)
      logger.info(`Worker ${createdWorker.name} ready to work`)
    } catch (error) {
      logger.error(`Error creating worker ${workerType}:`, error)
    }
  }
}
```

## Tipos de Trabajos (Jobs)

### 1. **Email Jobs**

Para envío de emails transaccionales:

```typescript
import { JobEnum } from '../utils/enums/jobs/jobs.enum'
import { TemplateEnum } from '../utils/enums/templates.enum'

// Trabajo de email de bienvenida
const welcomeEmailJob: EmailJobData = {
  type: JobEnum.EMAIL,
  template: TemplateEnum.WELCOME,
  payload: {
    to: 'user@example.com',
    userName: 'Juan Pérez',
  },
}

// Trabajo de recuperación de contraseña
const resetPasswordJob: EmailJobData = {
  type: JobEnum.EMAIL,
  template: TemplateEnum.PASSWORD_RECOVERY,
  payload: {
    to: 'user@example.com',
    code: '123456',
    resetPasswordToken: 'abc123xyz',
  },
}
```

### 2. **Dead Letter Jobs**

Para trabajos que han fallado múltiples veces:

```typescript
interface DeadLetterJobData {
  jobId: string
  queueName: string
  jobType: string
  jobData: any
}
```

## Dead Letter Queue (DLQ)

### Funcionamiento

1. **Trabajo falla** después del número máximo de reintentos
2. **Worker captura el fallo** y crea un registro en DLQ
3. **Se persiste en MongoDB** para análisis posterior
4. **Se notifica al sistema** a través de eventos

### Modelo de Datos

```typescript
// src/queueSystem/models/DeadLetter.ts
{
  jobId: string,        // ID único del trabajo
  queueName: string,    // Nombre de la cola original
  jobType: string,      // Tipo de trabajo
  jobData: object,      // Datos originales del trabajo
  createdAt: Date       // Timestamp del fallo
}
```

### Servicio de DLQ

```typescript
// src/queueSystem/services/deadLetterJob.service.ts
import deadLetterJobService from './queueSystem/services/deadLetterJob.service'

// Obtener trabajos fallidos
const failedJobs = await deadLetterJobService.findAll()

// Obtener por ID
const specificJob = await deadLetterJobService.findById(jobId)

// Crear nuevo registro DLQ
await deadLetterJobService.create(deadLetterData)
```

## Workers y Procesamiento

### Email Worker

```typescript
// src/queueSystem/workers/email/emailWorker.processor.ts
const emailJobProcessor = async (job: Job) => {
  try {
    if (job.data?.type !== 'email') {
      logger.info('⏭️  Skipping non-email job')
      return
    }

    const emailJob: EmailJobData = {
      type: job.data.type,
      template: job.data.template,
      payload: job.data.payload,
    }

    await emailHandler(emailJob)
  } catch (error) {
    logger.error(`❌ Email job failed, attempt: ${job.attemptsMade}`)
    throw error
  }
}
```

### Configuración de Workers

```typescript
// src/queueSystem/workers/email/emailWorker.config.ts
export const emailWorkerConfig: WorkerOptions = {
  concurrency: 5, // 5 trabajos simultáneos
  maxStalledCount: 1, // Máximo 1 trabajo bloqueado
  stalledInterval: 30000, // 30 segundos para detectar bloqueo
}
```

## Eventos del Sistema

### Worker Events

El sistema emite eventos durante el ciclo de vida de los trabajos:

```typescript
// src/queueSystem/events/workers/emailWorker.events.ts
async function attachEmailWorkerEvents(worker: Worker) {
  worker.on('completed', (job: Job) => {
    logger.info(`Job with id :${job.id} completed`)
  })

  worker.on('failed', (job: Job | undefined, err: Error) => {
    const maxAttempts = job?.opts.attempts ?? 1
    const attemptsMade = job?.attemptsMade ?? 0

    if (attemptsMade >= maxAttempts) {
      enqueueDeadLetterJob({
        id: job?.id ?? 'unknown',
        type: JobEnum.EMAIL,
        payload: job?.data,
        error: err,
        timestamp: new Date(),
      })
    }
  })
}
```

### Event Registry

```typescript
// src/queueSystem/events/workers/workerEvents.registry.ts
export const eventRegistry: Record<WorkerEnum, (worker: Worker) => Promise<void>> = {
  [WorkerEnum.EMAIL]: attachEmailWorkerEvents,
  [WorkerEnum.DEAD_LETTER]: attachDeadLetterWorkerEvents,
}
```

### Event Attacher

```typescript
// src/queueSystem/events/workers/workerEvents.attacher.ts
async function attachWorkerEvents(type: WorkerEnum, worker: Worker) {
  if (!eventRegistry[type]) throw new Error(`Worker with type: ${type} is not registered`)
  return await eventRegistry[type](worker)
}
```

## Uso Práctico

### En Auth Service

```typescript
// src/services/auth.service.ts
import { enqueueEmailJob } from '../queueSystem/jobs/email/email.job'
import { JobEnum } from '../utils/enums/jobs/jobs.enum'
import { TemplateEnum } from '../utils/enums/templates.enum'

class AuthService {
  async sendSignUpEmail(email: string, code: string, uuid: string) {
    await enqueueEmailJob({
      type: JobEnum.EMAIL,
      template: TemplateEnum.SIGNUP,
      payload: { to: email, code, uuid },
    })
  }
}
```

### En Controllers o Servicios

```typescript
// En cualquier controller o servicio
import { enqueueEmailJob } from '../queueSystem/jobs/email/email.job'
import { JobEnum } from '../utils/enums/jobs/jobs.enum'
import { TemplateEnum } from '../utils/enums/templates.enum'

try {
  // Lógica principal
  const result = await someService.processData(data)

  // Agregar trabajo asíncrono de email
  await enqueueEmailJob({
    type: JobEnum.EMAIL,
    template: TemplateEnum.WELCOME,
    payload: { to: 'user@example.com', userName: result.name },
  })

  res.success(result)
} catch (error) {
  res.error(error)
}
```

## Monitoreo y Debugging

### Logs de Workers

Todos los workers registran eventos importantes:

```bash
# Logs de desarrollo
Job with id :12345 completed
❌ Email job failed, attempt: 3
⏭️  Skipping non-email job
✅ Dead letter worker completed job 67890
❌ Dead letter worker failed job 11111: Connection timeout
```

### Dead Letter Analysis

```typescript
// Análisis de trabajos fallidos
const failedJobs = await deadLetterJobService.findAll()

console.log('Trabajos fallidos por tipo:')
failedJobs.forEach((job) => {
  console.log(`- ${job.jobType}: ${job.jobData}`)
})
```

## Testing

### Test del Queue Service

```typescript
// tests/unit/queueSystem/queue.service.spec.ts
describe('QueueService', () => {
  it('should add job to default queue', async () => {
    const jobData = { type: 'TEST_JOB', payload: {} }

    const job = await queueService.addJob(QueueName.DEFAULT, jobData)

    expect(job).toBeDefined()
    expect(job.data).toEqual(jobData)
  })
})
```

### Test de Dead Letter Service

```typescript
// tests/unit/queueSystem/services/deadLetterJob.service.spec.ts
describe('DeadLetterJobService', () => {
  it('should create dead letter job record', async () => {
    const deadLetterData = {
      jobId: '12345',
      queueName: 'default',
      jobType: 'EMAIL_JOB',
      jobData: { to: 'test@test.com' },
    }

    const result = await deadLetterJobService.create(deadLetterData)

    expect(result.jobId).toBe('12345')
    expect(result.queueName).toBe('default')
  })
})
```

### Coverage

El sistema de colas tiene **100% de cobertura** en:

- ✅ Queue Service
- ✅ Dead Letter Repository
- ✅ Dead Letter Service
- ✅ Job Handlers

---

## Extensibilidad

El sistema está diseñado para ser fácilmente extensible:

1. **Nuevos tipos de trabajos**: Crear handler en `jobs/`
2. **Nuevos workers**: Agregar configuración en `workers/`
3. **Nuevas colas**: Registrar en `queues/registry`
4. **Nuevos eventos**: Extender en `events/workers`

---

**📝 Nota**: Este sistema es fundamental para la escalabilidad de la aplicación, permitiendo procesar emails, notificaciones y otras tareas pesadas sin bloquear las respuestas HTTP.
