import { Connection } from 'mongoose'
import { createAdminUser, createSuperAdminUser, createUsers } from '../factories/user.factory'
import userService from '../services/user.service'
import logger from '../utils/logger'
import { CreateUserDTO } from '../DTOs/user/create.dto'
import { checkCollectionExistence } from '../utils/database.utils'

const USER_COUNT = 20

async function seedUsers(db: Connection) {
  try {
    await deleteUsers(db)
    logger.info('🏗️  Creating users...')
    await Promise.all([userService.create(createSuperAdminUser()), userService.create(createAdminUser())])

    const users: CreateUserDTO[] = createUsers(USER_COUNT)
    await Promise.all(users.map((user) => userService.create(user)))

    logger.info(`✅ Users created successfully (${USER_COUNT + 2} total users)`)
  } catch (error) {
    logger.error('❌ Error seeding users:', error)
  }
}

async function deleteUsers(db: Connection) {
  const collectionExists = await checkCollectionExistence(db, 'users')
  if (collectionExists) {
    try {
      logger.warn('⚠️  Dropping users collection - all existing users will be removed')
      await db.collection('users').drop()
      logger.info('✅ Users collection has been dropped')
    } catch (error) {
      logger.error('❌ Error dropping users collection:', error)
    }
  } else {
    logger.info('ℹ️  Users collection does not exist, skipping drop')
  }
}

export { seedUsers }
