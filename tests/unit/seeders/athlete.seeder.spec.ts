import { seedAthletes } from '../../../src/seeders/athlete.seeder'
import { Connection } from 'mongoose'
import { createAthletes } from '../../../src/factories/athlete.factory'
import { checkCollectionExistence } from '../../../src/utils/database.utils'
import athleteService from '../../../src/services/athlete.service'
import logger from '../../../src/utils/logger'
import { CreateAthleteDTO } from '../../../src/DTOs/athlete/create.dto'
import { GenderEnum } from '../../../src/utils/enums/gender.enum'
import { ObjectId } from 'mongodb'

// Mock dependencies
jest.mock('../../../src/factories/athlete.factory')
jest.mock('../../../src/utils/database.utils')
jest.mock('../../../src/services/athlete.service')
jest.mock('../../../src/utils/logger')

const mockCreateAthletes = createAthletes as jest.MockedFunction<typeof createAthletes>
const mockCheckCollectionExistence = checkCollectionExistence as jest.MockedFunction<typeof checkCollectionExistence>
const mockAthleteService = athleteService as jest.Mocked<typeof athleteService>
const mockLogger = logger as jest.Mocked<typeof logger>

interface MockCollection {
  drop: jest.Mock
}

describe('Athlete Seeder', () => {
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

  describe('seedAthletes', () => {
    it('should successfully seed athletes with default length', async () => {
      const mockAthletes: CreateAthleteDTO[] = [
        {
          email: 'athlete1@example.com',
          firstname: 'John',
          lastname: 'Doe',
          coach: new ObjectId(),
          idDocument: '123456789',
          gender: GenderEnum.MALE,
          height: 180,
          weight: 75,
          goals: ['build muscle'],
          notes: 'Test notes',
          phone: '+1234567890',
        },
        {
          email: 'athlete2@example.com',
          firstname: 'Jane',
          lastname: 'Smith',
          coach: new ObjectId(),
          idDocument: '987654321',
          gender: GenderEnum.FEMALE,
          height: 165,
          weight: 60,
          goals: ['fat loss'],
          notes: 'Test notes 2',
          phone: '+0987654321',
        },
      ]

      mockCheckCollectionExistence.mockResolvedValue(true)
      mockCreateAthletes.mockResolvedValue(mockAthletes)
      mockAthleteService.create.mockResolvedValue({ _id: new ObjectId() } as never)

      await seedAthletes(mockDb)

      expect(mockCheckCollectionExistence).toHaveBeenCalledWith(mockDb, 'athletes')
      expect(mockCollection.drop).toHaveBeenCalled()
      expect(mockCreateAthletes).toHaveBeenCalledWith(5, mockDb)
      expect(mockAthleteService.create).toHaveBeenCalledTimes(2)
      expect(mockAthleteService.create).toHaveBeenCalledWith(mockAthletes[0], mockAthletes[0].coach)
      expect(mockAthleteService.create).toHaveBeenCalledWith(mockAthletes[1], mockAthletes[1].coach)
      expect(mockLogger.info).toHaveBeenCalledWith('Athletes created successfully.')
    })

    it('should successfully seed athletes with custom length', async () => {
      const mockAthletes: CreateAthleteDTO[] = [
        {
          email: 'athlete1@example.com',
          firstname: 'John',
          lastname: 'Doe',
          coach: new ObjectId(),
          idDocument: '123456789',
          gender: GenderEnum.MALE,
          height: 180,
          weight: 75,
          goals: ['build muscle'],
          notes: 'Test notes',
          phone: '+1234567890',
        },
      ]

      mockCheckCollectionExistence.mockResolvedValue(false)
      mockCreateAthletes.mockResolvedValue(mockAthletes)
      mockAthleteService.create.mockResolvedValue({ _id: new ObjectId() } as never)

      await seedAthletes(mockDb, 1)

      expect(mockCollection.drop).not.toHaveBeenCalled()
      expect(mockCreateAthletes).toHaveBeenCalledWith(1, mockDb)
      expect(mockAthleteService.create).toHaveBeenCalledTimes(1)
      expect(mockLogger.info).toHaveBeenCalledWith('Athletes created successfully.')
    })

    it('should handle collection drop when collection exists', async () => {
      const mockAthletes: CreateAthleteDTO[] = []

      mockCheckCollectionExistence.mockResolvedValue(true)
      mockCreateAthletes.mockResolvedValue(mockAthletes)

      await seedAthletes(mockDb, 0)

      expect(mockCheckCollectionExistence).toHaveBeenCalledWith(mockDb, 'athletes')
      expect(mockCollection.drop).toHaveBeenCalled()
      expect(mockLogger.info).toHaveBeenCalledWith('Athletes collection dropped successfully.')
    })

    it('should not drop collection when collection does not exist', async () => {
      const mockAthletes: CreateAthleteDTO[] = []

      mockCheckCollectionExistence.mockResolvedValue(false)
      mockCreateAthletes.mockResolvedValue(mockAthletes)

      await seedAthletes(mockDb, 0)

      expect(mockCheckCollectionExistence).toHaveBeenCalledWith(mockDb, 'athletes')
      expect(mockCollection.drop).not.toHaveBeenCalled()
    })

    it('should handle errors during seeding process', async () => {
      const error = new Error('Seeding failed')
      mockCheckCollectionExistence.mockRejectedValue(error)

      await seedAthletes(mockDb)

      expect(mockLogger.error).toHaveBeenCalledWith('Error seeding athletes:', error)
    })

    it('should handle errors during collection drop', async () => {
      const error = new Error('Drop failed')
      mockCheckCollectionExistence.mockResolvedValue(true)
      mockCollection.drop.mockRejectedValue(error)
      mockCreateAthletes.mockResolvedValue([])

      await seedAthletes(mockDb)

      expect(mockLogger.error).toHaveBeenCalledWith('Error dropping athletes collection:', error)
    })

    it('should handle errors during athlete creation', async () => {
      const mockAthletes: CreateAthleteDTO[] = [
        {
          email: 'athlete1@example.com',
          firstname: 'John',
          lastname: 'Doe',
          coach: new ObjectId(),
          idDocument: '123456789',
          gender: GenderEnum.MALE,
          height: 180,
          weight: 75,
          goals: ['build muscle'],
          notes: 'Test notes',
          phone: '+1234567890',
        },
      ]

      const error = new Error('Create athlete failed')
      mockCheckCollectionExistence.mockResolvedValue(false)
      mockCreateAthletes.mockResolvedValue(mockAthletes)
      mockAthleteService.create.mockRejectedValue(error)

      await seedAthletes(mockDb)

      expect(mockLogger.error).toHaveBeenCalledWith('Error seeding athletes:', error)
    })
  })
})
