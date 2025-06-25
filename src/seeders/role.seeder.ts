import { Connection } from 'mongoose'
import roleRepository from '../repositories/role.repository'
import logger from '../utils/logger'
import { checkCollectionExistence } from '../utils/database.utils'

const collectionName = 'roles'

async function seedRoles(roles: string[], db: Connection): Promise<void> {
  try {
    await deleteRoles(db)
    await Promise.all(roles.map((role) => roleRepository.create(role)))
    logger.info(`Roles created successfully`)
  } catch (error) {
    logger.error(error)
  }
}

async function deleteRoles(db: Connection): Promise<void> {
  const collectionExists = await checkCollectionExistence(db, collectionName)
  if (collectionExists) {
    try {
      await db.collection(collectionName).drop()
      logger.info('Roles collection has been dropped')
    } catch (error) {
      logger.error(error)
    }
  }
}

export { seedRoles }
