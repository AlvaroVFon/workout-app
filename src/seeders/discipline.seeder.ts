import { Connection } from 'mongoose'
import { createDiscipline } from '../factories/discipline.factory'
import disciplineService from '../services/discipline.service'
import { checkCollectionExistence } from '../utils/database.utils'
import logger from '../utils/logger'
import { disciplineMocks } from './discipline.mocks'

async function seedDisciplines(db: Connection) {
  try {
    await deleteDisciplines(db)
    for (const mock of disciplineMocks) {
      await disciplineService.createDiscipline(createDiscipline(mock))
    }
    logger.info('Disciplines created successfully.')
  } catch (error) {
    logger.error('Error seeding disciplines:', error)
  }
}

async function deleteDisciplines(db: Connection) {
  const collectionExists = await checkCollectionExistence(db, 'disciplines')
  if (collectionExists) {
    await db.collection('disciplines').drop()
    logger.info('Disciplines collection has been dropped')
  }
}

export { deleteDisciplines, seedDisciplines }
