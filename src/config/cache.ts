import { createClient, RedisClientType } from 'redis'
import logger from '../utils/logger'
import { parameters } from './parameters'

let cacheClient: RedisClientType

async function connectCache(): Promise<void> {
  cacheClient = createClient({ url: parameters.cacheUrl })
  try {
    await cacheClient.connect()
    logger.info('Connected to the cache', parameters.cacheUrl)
  } catch (error) {
    logger.error('Error connecting to the cache', error)
  }
}

function getCacheClient(): RedisClientType {
  return cacheClient
}

export { connectCache, getCacheClient }
