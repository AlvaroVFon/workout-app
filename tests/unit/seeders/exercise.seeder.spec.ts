import { seedExercises } from '../../../src/seeders/exercise.seeder'
import { Connection } from 'mongoose'
import { createExercise } from '../../../src/factories/exercise.factory'
import exerciseService from '../../../src/services/exercise.service'
import logger from '../../../src/utils/logger'
import { checkCollectionExistence } from '../../../src/utils/database.utils'
import { CreateExerciseDTO } from '../../../src/DTOs/exercise/create.dto'
import { MusclesEnum } from '../../../src/utils/enums/muscles.enum'
import { ObjectId } from 'mongodb'

// Mock dependencies
jest.mock('../../../src/factories/exercise.factory')
jest.mock('../../../src/services/exercise.service')
jest.mock('../../../src/utils/logger')
jest.mock('../../../src/utils/database.utils')

const mockCreateExercise = createExercise as jest.MockedFunction<typeof createExercise>
const mockExerciseService = exerciseService as jest.Mocked<typeof exerciseService>
const mockLogger = logger as jest.Mocked<typeof logger>
const mockCheckCollectionExistence = checkCollectionExistence as jest.MockedFunction<typeof checkCollectionExistence>

interface MockCollection {
  drop: jest.Mock
}

describe('Exercise Seeder', () => {
  let mockDb: jest.Mocked<Connection>
  let mockCollection: MockCollection

  beforeEach(() => {
    mockCollection = {
      drop: jest.fn(),
    }

    mockDb = {
      collection: jest.fn(() => mockCollection),
    } as unknown as jest.Mocked<Connection>

    jest.clearAllMocks()
  })

  describe('seedExercises', () => {
    it('should successfully seed 21 exercises', async () => {
      const mockExercise: CreateExerciseDTO = {
        name: 'Test Exercise',
        description: 'Test description',
        difficulty: 'medium',
        muscles: [MusclesEnum.CHEST, MusclesEnum.TRICEPS],
      }

      mockCheckCollectionExistence.mockResolvedValue(true)
      mockCreateExercise.mockReturnValue(mockExercise)
      mockExerciseService.create.mockResolvedValue({ _id: new ObjectId() } as never)

      await seedExercises(mockDb)

      expect(mockCheckCollectionExistence).toHaveBeenCalledWith(mockDb, 'exercises')
      expect(mockCollection.drop).toHaveBeenCalled()
      expect(mockLogger.info).toHaveBeenCalledWith('Exercises collection dropped')

      expect(mockCreateExercise).toHaveBeenCalledTimes(21)
      expect(mockExerciseService.create).toHaveBeenCalledTimes(21)
      expect(mockExerciseService.create).toHaveBeenCalledWith(mockExercise)

      expect(mockLogger.info).toHaveBeenCalledWith('Exercises created successfully')
    })

    it('should not drop collection when collection does not exist', async () => {
      const mockExercise: CreateExerciseDTO = {
        name: 'Test Exercise',
        description: 'Test description',
        difficulty: 'easy',
        muscles: [MusclesEnum.QUADS],
      }

      mockCheckCollectionExistence.mockResolvedValue(false)
      mockCreateExercise.mockReturnValue(mockExercise)
      mockExerciseService.create.mockResolvedValue({ _id: new ObjectId() } as never)

      await seedExercises(mockDb)

      expect(mockCheckCollectionExistence).toHaveBeenCalledWith(mockDb, 'exercises')
      expect(mockCollection.drop).not.toHaveBeenCalled()

      expect(mockCreateExercise).toHaveBeenCalledTimes(21)
      expect(mockExerciseService.create).toHaveBeenCalledTimes(21)
      expect(mockLogger.info).toHaveBeenCalledWith('Exercises created successfully')
    })

    it('should handle errors during seeding process', async () => {
      const error = new Error('Seeding failed')
      mockCheckCollectionExistence.mockRejectedValue(error)

      await seedExercises(mockDb)

      expect(mockLogger.error).toHaveBeenCalledWith(error)
    })

    it('should handle errors during collection drop', async () => {
      const error = new Error('Drop failed')
      mockCheckCollectionExistence.mockResolvedValue(true)
      mockCollection.drop.mockRejectedValue(error)

      await seedExercises(mockDb)

      expect(mockLogger.error).toHaveBeenCalledWith(error)
    })

    it('should handle errors during exercise creation', async () => {
      const error = new Error('Create exercise failed')
      const mockExercise: CreateExerciseDTO = {
        name: 'Test Exercise',
        description: 'Test description',
        difficulty: 'hard',
        muscles: [MusclesEnum.BACK],
      }

      mockCheckCollectionExistence.mockResolvedValue(false)
      mockCreateExercise.mockReturnValue(mockExercise)
      mockExerciseService.create.mockRejectedValue(error)

      await seedExercises(mockDb)

      expect(mockLogger.error).toHaveBeenCalledWith(error)
    })

    it('should create exactly 21 exercises', async () => {
      const mockExercise: CreateExerciseDTO = {
        name: 'Test Exercise',
        description: 'Test description',
        difficulty: 'medium',
        muscles: [MusclesEnum.SHOULDERS],
      }

      mockCheckCollectionExistence.mockResolvedValue(false)
      mockCreateExercise.mockReturnValue(mockExercise)
      mockExerciseService.create.mockResolvedValue({ _id: new ObjectId() } as never)

      await seedExercises(mockDb)

      // Verify that exactly 21 exercises are created
      expect(mockCreateExercise).toHaveBeenCalledTimes(21)
      expect(mockExerciseService.create).toHaveBeenCalledTimes(21)
    })

    it('should call createExercise without parameters for each exercise', async () => {
      const mockExercise: CreateExerciseDTO = {
        name: 'Generated Exercise',
        description: 'Generated description',
        difficulty: 'medium',
        muscles: Object.values(MusclesEnum),
      }

      mockCheckCollectionExistence.mockResolvedValue(false)
      mockCreateExercise.mockReturnValue(mockExercise)
      mockExerciseService.create.mockResolvedValue({ _id: new ObjectId() } as never)

      await seedExercises(mockDb)

      // Verify that createExercise is called without parameters (using defaults)
      for (let i = 0; i < 21; i++) {
        expect(mockCreateExercise).toHaveBeenNthCalledWith(i + 1)
      }
    })
  })
})
