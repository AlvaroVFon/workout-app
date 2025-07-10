import { Connection } from 'mongoose'
import { createAdminUser, createSuperAdminUser, createUsers } from '../factories/user.factory'
import userService from '../services/user.service'
import logger from '../utils/logger'
import { checkCollectionExistence } from '../utils/database.utils'

const USER_COUNT = 20

async function seedUsers(db: Connection) {
  try {
    await deleteUsers(db)
    await userService.create(await createAdminUser())
    await userService.create(await createSuperAdminUser())

    await createUsers(USER_COUNT)

    logger.info('Users created successfully')
  } catch (error) {
    logger.error(error)
  }
}

async function deleteUsers(db: Connection) {
  const collectionExists = await checkCollectionExistence(db, 'users')
  if (collectionExists) {
    try {
      await db.collection('users').drop()
      logger.info('Users collection has been dropped')
    } catch (error) {
      logger.error(error)
    }
  }
}

export { seedUsers }
