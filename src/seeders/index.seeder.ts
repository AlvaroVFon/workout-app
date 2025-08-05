import { connectDatabase, getDatabase } from '../config/db'
import { MusclesEnum } from '../utils/enums/muscles.enum'
import { RolesEnum } from '../utils/enums/roles.enum'
import logger from '../utils/logger'
import { seedAthletes } from './athlete.seeder'
import { seedDisciplines } from './discipline.seeder'
import { seedExercises } from './exercise.seeder'
import { seedMuscles } from './muscles.seeder'
import { seedRoles } from './role.seeder'
import { seedTrainingSessions } from './trainingSession.seeder'
import { seedUsers } from './user.seeder'

async function seed() {
  try {
    await connectDatabase()
    const db = await getDatabase()

    await seedRoles(Object.values(RolesEnum), db)
    await seedMuscles(Object.values(MusclesEnum), db)
    await seedDisciplines(db)

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
