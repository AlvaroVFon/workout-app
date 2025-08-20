import mongoose from 'mongoose'
import logger from '../utils/logger'
import { seedAthleteStatsTestData } from './athleteStatsTestData.seeder'

async function main() {
  try {
    // Conectar a MongoDB usando las mismas configuraciones del proyecto
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/workout-app'
    await mongoose.connect(mongoUri)
    logger.info('Connected to MongoDB')

    // Ejecutar el seeder
    await seedAthleteStatsTestData(mongoose.connection)

    logger.info('✅ Athlete stats test data seeded successfully!')
  } catch (error) {
    logger.error('❌ Error seeding athlete stats test data:', error)
  } finally {
    await mongoose.disconnect()
    logger.info('Disconnected from MongoDB')
    process.exit(0)
  }
}

main()
