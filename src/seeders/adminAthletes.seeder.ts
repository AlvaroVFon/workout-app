import { connectDatabase, getDatabase } from '../config/db'
import logger from '../utils/logger'
import { seedAdminAthletes } from './athlete.seeder'

async function seed() {
  try {
    await connectDatabase()
    const db = await getDatabase()

    await seedAdminAthletes(db, coachEmail, 80)
  } catch (error) {
    logger.error('Error seeding database: ', error)
  } finally {
    process.exit()
  }
}

const coachEmail = process.env.SEED_ADMIN_EMAIL || process.argv[2] || 'admin@email.com'

seed()
