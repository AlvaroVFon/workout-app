import { Connection } from 'mongoose'
import { createAthletes } from '../factories/athlete.factory'
import athleteService from '../services/athlete.service'
import { checkCollectionExistence } from '../utils/database.utils'
import logger from '../utils/logger'

const collectionName = 'athletes'

async function seedAthletes(db: Connection, length: number = 5): Promise<void> {
  try {
    await deleteAthletes(db)
    const athletes = await createAthletes(length, db)
    await Promise.all(athletes.map((athlete) => athleteService.create(athlete, athlete.coach)))
    logger.info('Athletes created successfully.')
  } catch (error) {
    logger.error('Error seeding athletes:', error)
  }
}

async function seedAdminAthletes(db: Connection, coachEmail: string, length: number = 5): Promise<void> {
  try {
    const athletes = await createAthletes(length, db)
    const coach = await db.collection('users').findOne({ email: coachEmail }, { projection: { _id: 1 } })
    if (!coach) {
      throw new Error(`Coach with email ${coachEmail} not found`)
    }
    await Promise.all(athletes.map((athlete) => athleteService.create(athlete, coach._id)))
    logger.info('Admin athletes created successfully.')
  } catch (error) {
    logger.error('Error seeding admin athletes:', error)
  }
}

async function deleteAthletes(db: Connection): Promise<void> {
  const collectionExists = await checkCollectionExistence(db, collectionName)
  if (collectionExists) {
    try {
      await db.collection(collectionName).drop()
      logger.info('Athletes collection dropped successfully.')
    } catch (error) {
      logger.error('Error dropping athletes collection:', error)
    }
  }
}

export { seedAdminAthletes, seedAthletes }
