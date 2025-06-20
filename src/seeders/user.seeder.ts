import { Connection } from 'mongoose'
import { createAdminUser, createSuperAdminUser, createUser } from '../factories/user.factory'
import userService from '../services/user.service'
import logger from '../utils/logger'
import { CreateUserDTO } from '../DTOs/user/create.dto'

const USER_COUNT = 20

async function seedUsers(db: Connection) {
  try {
    await deleteUsers(db)
    await Promise.all([userService.create(createSuperAdminUser()), userService.create(createAdminUser())])

    const users: CreateUserDTO[] = Array.from({ length: USER_COUNT }, () => createUser())
    await Promise.all(users.map((user) => userService.create(user)))

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
