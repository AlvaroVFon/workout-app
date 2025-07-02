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
import * as readline from 'readline'

interface SeedOptions {
  resources?: string[]
  confirm?: boolean
  help?: boolean
}

const AVAILABLE_RESOURCES = {
  roles: 'Seed user roles (admin, user, etc.)',
  muscles: 'Seed muscle groups and types',
  users: 'Seed users (admin and regular users)',
  exercises: 'Seed exercise data',
  athletes: 'Seed athlete profiles',
  trainingSessions: 'Seed training session data',
  all: 'Seed all resources (default behavior)',
}

function parseArgs(): SeedOptions {
  const args = process.argv.slice(2)
  const options: SeedOptions = {}

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    if (arg === '--help' || arg === '-h') {
      options.help = true
    } else if (arg === '--yes' || arg === '-y') {
      options.confirm = true
    } else if (arg === '--resources' || arg === '-r') {
      const resourcesArg = args[i + 1]
      if (resourcesArg && !resourcesArg.startsWith('-')) {
        options.resources = resourcesArg.split(',').map((r) => r.trim())
        i++
      }
    } else if (!arg.startsWith('-')) {
      // Treat non-flag arguments as resources
      if (!options.resources) options.resources = []
      options.resources.push(...arg.split(',').map((r) => r.trim()))
    }
  }

  return options
}

function showHelp() {
  console.log(`
🌱 Workout App Database Seeder

Usage: yarn seed [options] [resources]

Options:
  -h, --help              Show this help message
  -y, --yes              Skip confirmation prompts
  -r, --resources <list>  Comma-separated list of resources to seed

Available Resources:`)

  Object.entries(AVAILABLE_RESOURCES).forEach(([key, description]) => {
    console.log(`  ${key.padEnd(15)} ${description}`)
  })

  console.log(`
Examples:
  yarn seed                           # Seed all resources (with confirmation)
  yarn seed -y                        # Seed all resources (no confirmation)
  yarn seed roles,users               # Seed only roles and users
  yarn seed -r users,exercises -y     # Seed users and exercises without confirmation
  yarn seed --help                    # Show this help

⚠️  WARNING: Seeding will DROP existing data in the selected collections!
`)
}

async function confirmSeeding(resources: string[]): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    console.log('\n⚠️  WARNING: Database Seeding Operation')
    console.log('=====================================')
    console.log('This operation will DROP the following collections and recreate them:')
    resources.forEach((resource) => {
      console.log(`  🗑️  ${resource} collection`)
    })
    console.log('\n❌ ALL EXISTING DATA in these collections will be LOST!')
    console.log('✅ New seed data will be created')

    rl.question('\nDo you want to continue? (yes/no): ', (answer) => {
      rl.close()
      const confirmed = answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y'
      resolve(confirmed)
    })
  })
}

async function seedByResource(resource: string, db: any): Promise<void> {
  logger.info(`🌱 Starting to seed ${resource}...`)

  switch (resource) {
    case 'roles':
      await seedRoles(Object.values(RolesEnum), db)
      break
    case 'muscles':
      await seedMuscles(Object.values(MusclesEnum), db)
      break
    case 'users':
      await seedUsers(db)
      break
    case 'exercises':
      await seedExercises(db)
      break
    case 'athletes':
      await seedAthletes(db, 10)
      break
    case 'trainingSessions':
      await seedTrainingSessions(db, 10)
      break
    default:
      logger.warn(`⚠️  Unknown resource: ${resource}`)
  }

  logger.info(`✅ Completed seeding ${resource}`)
}

async function seed() {
  const options = parseArgs()

  if (options.help) {
    showHelp()
    process.exit(0)
  }

  // Determine which resources to seed
  const resourcesToSeed = options.resources || ['all']

  // Expand 'all' to individual resources
  const actualResources = resourcesToSeed.includes('all')
    ? ['roles', 'muscles', 'users', 'exercises', 'athletes', 'trainingSessions']
    : resourcesToSeed

  // Validate resources
  const invalidResources = actualResources.filter((r) => !Object.keys(AVAILABLE_RESOURCES).includes(r) && r !== 'all')
  if (invalidResources.length > 0) {
    logger.error(`Invalid resources: ${invalidResources.join(', ')}`)
    logger.info('Use --help to see available resources')
    process.exit(1)
  }

  // Confirm before proceeding (unless --yes flag is used)
  if (!options.confirm) {
    const confirmed = await confirmSeeding(actualResources)
    if (!confirmed) {
      logger.info('Seeding cancelled by user')
      process.exit(0)
    }
  }

  try {
    await connectDatabase()
    const db = await getDatabase()

    logger.info(`🌱 Starting database seeding for: ${actualResources.join(', ')}`)

    // Seed in order for dependencies
    const orderedResources = ['roles', 'muscles', 'users', 'exercises', 'athletes', 'trainingSessions']
    for (const resource of orderedResources) {
      if (actualResources.includes(resource)) {
        await seedByResource(resource, db)
      }
    }

    logger.info('✅ Database seeding completed successfully!')
  } catch (error) {
    logger.error('❌ Error seeding database: ', error)
    process.exit(1)
  } finally {
    process.exit(0)
  }
}

seed()
