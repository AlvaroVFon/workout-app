import type { RedisClientType } from 'redis'
import { getCacheClient } from '../config/cache'
import { parameters } from '../config/parameters'

class CacheService {
  private readonly ttl: number = parameters.cacheTtl

  private get client(): RedisClientType {
    return getCacheClient()
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.client.set(key, JSON.stringify(value), { EX: ttl ?? this.ttl })
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key)
    return value ? (JSON.parse(value) as T) : null
  }

  async delete(key: string): Promise<boolean> {
    const result = await this.client.del(key)
    return result > 0
  }
}

export default new CacheService()
