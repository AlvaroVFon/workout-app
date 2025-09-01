import { Connection } from 'mongoose'
import { createTrainingSessions } from '../factories/trainingSession.factory'
import logger from '../utils/logger'
import { checkCollectionExistence } from '../utils/database.utils'
import trainingSessionService from '../services/trainingSession.service'

const collectionName = 'trainingsessions'

async function seedTrainingSessions(db: Connection, length: number = 5): Promise<void> {
  try {
    await deleteTrainingSessions(db)
    const trainingSessions = await createTrainingSessions(length, db)

    await Promise.all(trainingSessions.map((session) => trainingSessionService.create(session)))
    logger.info('Training sessions created successfully.')
  } catch (error) {
    logger.error('Error seeding training sessions:', error)
  }
}

async function deleteTrainingSessions(db: Connection): Promise<void> {
  const collectionExists = await checkCollectionExistence(db, collectionName)
  if (collectionExists) {
    try {
      await db.collection(collectionName).drop()
      logger.info('Training sessions collection dropped successfully.')
    } catch (error) {
      logger.error('Error dropping training sessions collection:', error)
    }
  }
}

export { seedTrainingSessions }
