import { Connection } from 'mongoose'
import muscleRepository from '../repositories/muscle.repository'
import logger from '../utils/logger'
import { checkCollectionExistence } from '../utils/database.utils'

const collectionName = 'muscles'

async function seedMuscles(muscles: string[], db: Connection): Promise<void> {
  try {
    await deleteMuscles(db)
    await Promise.all(
      muscles.map((muscle) => {
        muscleRepository.create(muscle)
      }),
    )
    logger.info('Muscles created successfully')
  } catch (error) {
    logger.error(error)
  }
}

async function deleteMuscles(db: Connection): Promise<void> {
  const collectionExists = await checkCollectionExistence(db, collectionName)
  if (collectionExists) {
    try {
      await db.collection(collectionName).drop()
      logger.info('Muscles collection has been dropped')
    } catch (error) {
      logger.error(error)
    }
  }
}

export { seedMuscles }
