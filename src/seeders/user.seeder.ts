import { Connection } from 'mongoose'
import { createAdminUser, createSuperAdminUser } from '../factories/user.factory'
import userService from '../services/user.service'
import logger from '../utils/logger'

async function seedUsers(db: Connection) {
  try {
    await deleteUsers(db)
    await Promise.all([userService.create(createSuperAdminUser()), userService.create(createAdminUser())])
    logger.info('Users created successfully')
  } catch (error) {
    logger.error(error)
  }
}

async function deleteUsers(db: Connection) {
  try {
    await db.collection('users').drop()
    logger.info('Users collection has been dropped')
  } catch (error) {
    logger.error(error)
  }
}

export { seedUsers }
