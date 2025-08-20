import { ObjectId } from 'mongodb'
import { Connection } from 'mongoose'
import { TrainingSessionDTO } from '../DTOs/trainingSession/trainingSession.dto'
import trainingSessionService from '../services/trainingSession.service'
import { TrainingTypeEnum } from '../utils/enums/trainingTypes.enum'
import logger from '../utils/logger'

/**
 * Seeder específico para crear datos de prueba realistas para las estadísticas de atletas
 * Crea sesiones de entrenamiento variadas en diferentes períodos para probar funcionalidad
 */

async function seedAthleteStatsTestData(db: Connection): Promise<void> {
  try {
    // Obtener un atleta existente para las pruebas
    const athlete = await db.collection('athletes').findOne({})
    if (!athlete) {
      logger.error('No athletes found. Please seed athletes first.')
      return
    }

    // Obtener algunos ejercicios
    const exercises = await db.collection('exercises').find({}).limit(10).toArray()
    if (exercises.length === 0) {
      logger.error('No exercises found. Please seed exercises first.')
      return
    }

    const athleteId = athlete._id
    const exerciseIds = exercises.map((ex) => ex._id)

    logger.info(`Creating test data for athlete: ${athleteId}`)

    // Crear sesiones de los últimos 3 meses con patrones realistas
    const sessions = createRealisticTrainingSessions(athleteId, exerciseIds)

    // Crear las sesiones en la base de datos
    await Promise.all(sessions.map((session) => trainingSessionService.create(session)))

    logger.info(`✅ Created ${sessions.length} training sessions for statistics testing`)
    logger.info(`📊 Test athlete ID: ${athleteId}`)
    logger.info(`🔗 Test endpoint: GET /athletes/${athleteId}/stats`)
  } catch (error) {
    logger.error('Error seeding athlete stats test data:', error)
  }
}

function createRealisticTrainingSessions(athleteId: ObjectId, exerciseIds: ObjectId[]): TrainingSessionDTO[] {
  const sessions: TrainingSessionDTO[] = []
  const now = new Date()

  // Crear sesiones para los últimos 90 días
  for (let daysAgo = 0; daysAgo < 90; daysAgo++) {
    const sessionDate = new Date(now)
    sessionDate.setDate(sessionDate.getDate() - daysAgo)

    // Entrenar 4-5 días por semana (skip algunos días)
    const dayOfWeek = sessionDate.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6 || Math.random() < 0.2) {
      continue // Skip domingos, sábados y algunos días aleatorios
    }

    // Alternar tipos de entrenamiento
    const trainingTypes = [
      TrainingTypeEnum.STRENGTH,
      TrainingTypeEnum.ENDURANCE,
      TrainingTypeEnum.EXPLOSIVE,
      TrainingTypeEnum.MOBILITY,
    ]
    const trainingType = trainingTypes[daysAgo % trainingTypes.length]

    // Crear ejercicios para la sesión (3-6 ejercicios)
    const numExercises = Math.floor(Math.random() * 4) + 3
    const sessionExercises = []

    for (let i = 0; i < numExercises; i++) {
      const exerciseId = exerciseIds[Math.floor(Math.random() * exerciseIds.length)]
      const numSets = Math.floor(Math.random() * 3) + 2 // 2-4 sets

      const sets = []
      for (let setNum = 0; setNum < numSets; setNum++) {
        // Progresión realista: más peso/reps en meses más recientes
        const progressionFactor = 1 - (daysAgo / 90) * 0.3 // 30% menos hace 3 meses

        const baseWeight = 50 + Math.floor(Math.random() * 100) // 50-150kg base
        const baseReps = 8 + Math.floor(Math.random() * 7) // 8-14 reps base

        sets.push({
          reps: Math.max(1, Math.floor(baseReps * progressionFactor)),
          weight: Math.max(20, Math.floor(baseWeight * progressionFactor)),
          rir: Math.floor(Math.random() * 4) + 1, // 1-4 RIR
        })
      }

      sessionExercises.push({
        exercise: exerciseId,
        sets,
      })
    }

    // Duración y esfuerzo realistas
    const sessionDuration = 45 + Math.floor(Math.random() * 45) // 45-90 min
    const perceivedEffort = 6 + Math.floor(Math.random() * 4) // 6-9 RPE

    // Calcular semana, mes, año automáticamente
    const year = sessionDate.getFullYear()
    const month = sessionDate.getMonth() + 1
    const week = getWeekNumber(sessionDate)

    sessions.push({
      athlete: athleteId,
      date: sessionDate,
      type: trainingType,
      exercises: sessionExercises,
      sessionDuration,
      perceivedEffort,
      week,
      month,
      year,
      notes: `${trainingType} session - Day ${90 - daysAgo}`,
      tags: getSessionTags(trainingType),
    })
  }

  return sessions
}

function getWeekNumber(date: Date): number {
  const firstDay = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDay.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDay.getDay() + 1) / 7)
}

function getSessionTags(type: TrainingTypeEnum): string[] {
  const tagMap: Record<TrainingTypeEnum, string[]> = {
    [TrainingTypeEnum.STRENGTH]: ['gym', 'heavy', 'power'],
    [TrainingTypeEnum.ENDURANCE]: ['cardio', 'endurance', 'heart-rate'],
    [TrainingTypeEnum.EXPLOSIVE]: ['explosive', 'power', 'speed'],
    [TrainingTypeEnum.MOBILITY]: ['mobility', 'recovery', 'stretching'],
    [TrainingTypeEnum.OTHER]: ['training', 'general'],
  }

  return tagMap[type] || ['training']
}

export { seedAthleteStatsTestData }
