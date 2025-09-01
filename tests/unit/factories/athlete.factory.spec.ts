import { ObjectId } from 'mongodb'
import { Connection } from 'mongoose'
import { CreateAthleteDTO } from '../../../src/DTOs/athlete/create.dto'
import { createAthlete, createAthletes } from '../../../src/factories/athlete.factory'
import { GenderEnum } from '../../../src/utils/enums/gender.enum'

interface MockOptions {
  min: number
  max: number
}

jest.mock('@faker-js/faker', () => ({
  faker: {
    internet: {
      email: jest.fn(() => 'test@example.com'),
    },
    person: {
      firstName: jest.fn(() => 'John'),
      lastName: jest.fn(() => 'Doe'),
    },
    string: {
      uuid: jest.fn(() => '123456789'),
    },
    helpers: {
      arrayElement: jest.fn((arr: any) => (Array.isArray(arr) ? arr[0] : undefined)),
      arrayElements: jest.fn(() => ['build muscle', 'fat loss']),
    },
    number: {
      int: jest.fn((options: MockOptions) => {
        if (options.min === 150 && options.max === 200) return 180 // height
        if (options.min === 50 && options.max === 200) return 75 // weight
        if (options.min === 0 && options.max === 10) return 5 // skip
        return 1
      }),
    },
    lorem: {
      sentence: jest.fn(() => 'Test notes'),
    },
    phone: {
      number: jest.fn(() => '+1234567890'),
    },
  },
}))

interface MockCollection {
  findOne: jest.Mock
  find?: jest.Mock
}

describe('Athlete Factory', () => {
  let mockDb: jest.Mocked<Connection>
  let mockCollection: MockCollection
  let mockDiscipline: { _id: ObjectId }

  beforeEach(() => {
    mockDiscipline = { _id: new ObjectId() }

    mockCollection = {
      findOne: jest.fn(),
      find: jest.fn(() => ({
        project: jest.fn(() => ({ toArray: jest.fn().mockResolvedValue([mockDiscipline]) })),
      })),
    }

    mockDb = {
      collection: jest.fn((name: string) => mockCollection),
    } as unknown as jest.Mocked<Connection>

    jest.clearAllMocks()
  })

  describe('createAthlete', () => {
    it('should create an athlete with default values when no athlete is provided', async () => {
      const mockCoach = { _id: new ObjectId() }
      mockCollection.findOne.mockResolvedValue(mockCoach)

      const result = await createAthlete(mockDb)

      expect(result).toEqual({
        email: 'test@example.com',
        firstname: 'John',
        lastname: 'Doe',
        coach: mockCoach._id,
        disciplines: mockDiscipline._id,
        idDocument: '123456789',
        gender: GenderEnum.MALE,
        height: 180,
        weight: 75,
        goals: ['build muscle', 'fat loss'],
        notes: 'Test notes',
        phone: '+1234567890',
      })

      expect(mockDb.collection).toHaveBeenCalledWith('users')
      expect(mockCollection.findOne).toHaveBeenCalledWith({}, { projection: { _id: 1 }, skip: 5 })
    })

    it('should use provided athlete data when available', async () => {
      const coachId = new ObjectId('507f1f77bcf86cd799439011')
      const providedAthlete: CreateAthleteDTO = {
        email: 'custom@example.com',
        firstname: 'Jane',
        lastname: 'Smith',
        coach: coachId,
        idDocument: 'custom-id',
        gender: GenderEnum.FEMALE,
        height: 165,
        weight: 60,
        goals: ['performance'],
        notes: 'Custom notes',
        phone: '+9876543210',
      }

      const result = await createAthlete(mockDb, providedAthlete)

      expect(result.email).toBe(providedAthlete.email)
      expect(result.firstname).toBe(providedAthlete.firstname)
      expect(result.lastname).toBe(providedAthlete.lastname)
      expect(result.coach.toString()).toBe(coachId.toString())
      expect(result.idDocument).toBe(providedAthlete.idDocument)
      expect(result.gender).toBe(providedAthlete.gender)
    })

    it('should use a new ObjectId for coach when coach is not found in database', async () => {
      mockCollection.findOne.mockResolvedValue(null)

      const result = await createAthlete(mockDb)

      expect(result.coach).toBeInstanceOf(ObjectId)
    })

    it('should handle partial athlete data', async () => {
      const mockCoach = { _id: new ObjectId() }
      mockCollection.findOne.mockResolvedValue(mockCoach)

      const partialAthlete = {
        email: 'partial@example.com',
        firstname: 'Partial',
      } as CreateAthleteDTO

      const result = await createAthlete(mockDb, partialAthlete)

      expect(result.email).toBe('partial@example.com')
      expect(result.firstname).toBe('Partial')
      expect(result.lastname).toBe('Doe') // Should use faker default
      expect(result.coach).toBe(mockCoach._id)
    })
  })

  describe('createAthletes', () => {
    it('should create default number of athletes when length is not provided', async () => {
      const mockCoach = { _id: new ObjectId() }
      mockCollection.findOne.mockResolvedValue(mockCoach)

      const result = await createAthletes(undefined, mockDb)

      expect(result).toHaveLength(5) // Default length
      expect(result[0]).toHaveProperty('email')
      expect(result[0]).toHaveProperty('firstname')
      expect(result[0]).toHaveProperty('lastname')
    })

    it('should create specified number of athletes', async () => {
      const mockCoach = { _id: new ObjectId() }
      mockCollection.findOne.mockResolvedValue(mockCoach)

      const result = await createAthletes(3, mockDb)

      expect(result).toHaveLength(3)
      result.forEach((athlete) => {
        expect(athlete).toHaveProperty('email')
        expect(athlete).toHaveProperty('firstname')
        expect(athlete).toHaveProperty('lastname')
        expect(athlete).toHaveProperty('coach')
      })
    })

    it('should create empty array when length is 0', async () => {
      const result = await createAthletes(0, mockDb)

      expect(result).toHaveLength(0)
      expect(result).toEqual([])
    })
  })
})
