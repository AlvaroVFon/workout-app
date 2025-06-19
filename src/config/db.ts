import mongoose, { Connection } from 'mongoose'
import { parameters } from './parameters'
import logger from '../utils/logger'

const { databaseUrl } = parameters

let db: Connection

async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(databaseUrl)
    db = mongoose.connection
    logger.info('Connected to the database', databaseUrl)
  } catch (error) {
    logger.error('Error connecting to the database', error)
  }
}

async function getDatabase(): Promise<Connection> {
  if (!db) throw new Error('Database not connected. Call connectDatabase first.')

  return db
}

export { connectDatabase, getDatabase }
