import { Connection } from 'mongoose'
import exerciseService from '../services/exercise.service'
import logger from '../utils/logger'
import { createExercise } from '../factories/exercise.factory'

async function seedExercises(db: Connection): Promise<void> {
  try {
    await deleteExercises(db)
    const exercises = Array.from({ length: 21 }, () => createExercise())
    await Promise.all(exercises.map((exercise) => exerciseService.create(exercise)))
    logger.info('Exercises created successfully')
  } catch (error) {
    logger.error(error)
  }
}

async function deleteExercises(db: Connection) {
  try {
    await db.collection('exercises').drop()
    logger.info('Exercises collection dropped')
  } catch (error) {
    logger.error(error)
  }
}

export { seedExercises }
