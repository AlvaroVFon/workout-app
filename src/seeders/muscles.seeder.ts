import { Connection } from 'mongoose'
import muscleRepository from '../repositories/muscle.repository'
import logger from '../utils/logger'

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
  try {
    await db.collection('muscles').drop()

    logger.info('Muscles collection has been dropped')
  } catch (error) {
    logger.error(error)
  }
}

export { seedMuscles }
