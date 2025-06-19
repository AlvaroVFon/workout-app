import { connectDatabase, getDatabase } from '../config/db'
import { createAdminUser, createSuperAdminUser } from '../factories/user.factory'
import userService from '../services/user.service'
import logger from '../utils/logger'

async function seedUsers() {
  try {
    await deleteUsers()
    await Promise.all([userService.create(createSuperAdminUser()), userService.create(createAdminUser())])
    logger.info('Users created successfully')
  } catch (error) {
    logger.error(error)
  }
}

async function deleteUsers() {
  try {
    await connectDatabase()
    const db = await getDatabase()
    await db.collection('users').drop()
    logger.info('Users collection has been dropped')
  } catch (error) {
    logger.error(error)
  }
}

export { seedUsers }
