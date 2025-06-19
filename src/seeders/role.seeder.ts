import { connectDatabase, getDatabase } from '../config/db'
import roleRepository from '../repositories/role.repository'
import logger from '../utils/logger'

async function seedRoles(roles: string[]): Promise<void> {
  try {
    await deleteRoles()
    await Promise.all(roles.map((role) => roleRepository.create(role)))
    logger.info(`Roles created successfully`)
  } catch (error) {
    logger.error(error)
  }
}

async function deleteRoles() {
  try {
    await connectDatabase()
    const db = await getDatabase()

    await db.collection('roles').drop()
    logger.info('Roles collection has been dropped')
  } catch (error) {
    logger.error(error)
  }
}

export { seedRoles }
