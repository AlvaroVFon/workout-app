import { connectDatabase } from '../config/db'
import { seedMuscles } from './muscles.seeder'
import { seedRoles } from './role.seeder'
import { RolesEnum } from '../utils/enums/roles.enum'
import { MusclesEnum } from '../utils/enums/muscles.enum'
import logger from '../utils/logger'
import { seedUsers } from './user.seeder'

async function seed() {
  try {
    const dbConnection = await connectDatabase()
    await seedRoles(Object.values(RolesEnum), dbConnection)
    await seedMuscles(Object.values(MusclesEnum), dbConnection)
    await seedUsers(dbConnection)
  } catch (error) {
    logger.error('Error seeding database: ', error)
  } finally {
    process.exit()
  }
}

seed()
