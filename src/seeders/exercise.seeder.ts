import { Connection } from 'mongoose'
import exerciseService from '../services/exercise.service'
import logger from '../utils/logger'
import { createExercise } from '../factories/exercise.factory'
import { checkCollectionExistence } from '../utils/database.utils'

const collectionName = 'exercises'

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
  const collectionExists = await checkCollectionExistence(db, collectionName)
  if (collectionExists) {
    try {
      await db.collection(collectionName).drop()
      logger.info('Exercises collection dropped')
    } catch (error) {
      logger.error(error)
    }
  }
}

export { seedExercises }
