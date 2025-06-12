import { createClient } from 'redis'
import { parameters } from './parameters'
import logger from '../utils/logger'

async function connectCache(): Promise<void> {
  const client = createClient({ url: parameters.cacheUrl })
  try {
    await client.connect()
    logger.info('Connected to the cache', parameters.cacheUrl)
  } catch (error) {
    logger.error('Error connecting to the cache', error)
  }
}

export { connectCache }
