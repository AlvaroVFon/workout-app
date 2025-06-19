import { connectDatabase, getDatabase } from '../config/db'
import muscleRepository from '../repositories/muscle.repository'
import logger from '../utils/logger'

async function seedMuscles(muscles: string[]): Promise<void> {
  try {
    await deleteMuscles()
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

async function deleteMuscles() {
  try {
    await connectDatabase()
    const db = await getDatabase()

    await db.collection('muscles').drop()

    logger.info('Muscles collection has been dropped')
  } catch (error) {
    logger.error(error)
  }
}

export { seedMuscles }
