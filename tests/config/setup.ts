import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { Db } from 'mongodb'

let mongo: MongoMemoryServer
let db: Db | undefined

beforeAll(async () => {
  mongo = await MongoMemoryServer.create()
  const uri = mongo.getUri()

  await mongoose.connect(uri)
  db = mongoose.connection.db as unknown as Db
})

afterEach(async () => {
  db = mongoose.connection.db as unknown as Db
  if (db) {
    const collections = await db.collections()
    for (const collection of collections) {
      await collection.deleteMany({})
    }
  }
})

afterAll(async () => {
  await mongoose.connection.close()
  await mongo.stop()
})

function getDb() {
  return db
}

jest.mock('redis', () => import('redis-mock'))

export { getDb }
