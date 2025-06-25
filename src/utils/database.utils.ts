import { CollectionInfo } from 'mongodb'
import { Connection } from 'mongoose'

async function checkCollectionExistence(db: Connection, collectionName: string): Promise<boolean> {
  const collections = await db.listCollections()
  return collections.some((collection: CollectionInfo) => collection.name === collectionName)
}

export { checkCollectionExistence }
