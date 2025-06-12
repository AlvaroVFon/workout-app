import mongoose from 'mongoose'
import { parameters } from './parameters'
import logger from '../utils/logger'

const { databaseUrl } = parameters

async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(databaseUrl)
    logger.info('Connected to the database', databaseUrl)
  } catch (error) {
    logger.error('Error connecting to the database', error)
  }
}

export { connectDatabase }
