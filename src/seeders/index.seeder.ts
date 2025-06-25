import { connectDatabase, getDatabase } from '../config/db'
import { seedMuscles } from './muscles.seeder'
import { seedRoles } from './role.seeder'
import { RolesEnum } from '../utils/enums/roles.enum'
import { MusclesEnum } from '../utils/enums/muscles.enum'
import logger from '../utils/logger'
import { seedUsers } from './user.seeder'
import { seedExercises } from './exercise.seeder'
import { seedTrainingSessions } from './trainingSession.seeder'
import { seedAthletes } from './athlete.seeder'

async function seed() {
  try {
    await connectDatabase()
    const db = await getDatabase()

    await seedRoles(Object.values(RolesEnum), db)
    await seedMuscles(Object.values(MusclesEnum), db)

    await seedUsers(db)
    await seedExercises(db)

    await seedAthletes(db, 10)
    await seedTrainingSessions(db, 10)
  } catch (error) {
    logger.error('Error seeding database: ', error)
  } finally {
    process.exit()
  }
}

seed()
