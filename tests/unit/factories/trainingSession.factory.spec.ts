import { ObjectId } from 'mongodb'
import { Connection } from 'mongoose'
import { TrainingSessionDTO } from '../../../src/DTOs/trainingSession/trainingSession.dto'
import { createTrainingSession, createTrainingSessions } from '../../../src/factories/trainingSession.factory'
import { TrainingTypeEnum } from '../../../src/utils/enums/trainingTypes.enum'

interface MockOptions {
  min: number
  max: number
}

const mockDate = new Date('2024-01-15')

jest.mock('@faker-js/faker', () => ({
  faker: {
    number: {
      int: jest.fn((options: MockOptions) => {
        if (options.min === 1 && options.max === 20) return 10 // reps
        if (options.min === 0 && options.max === 200) return 75 // weight
        if (options.min === 0 && options.max === 5) return 2 // rir
        if (options.min === 0 && options.max === 10) return 3 // skip
        if (options.min === 1 && options.max === 10) return 3 // exercises length
        if (options.min === 1 && options.max === 52) return 3 // week
        if (options.min === 1 && options.max === 12) return 1 // month
        if (options.min === 2000 && options.max === 2024) return 2024 // year
        return 1
      }),
    },
    date: {
      recent: jest.fn(() => mockDate),
    },
    helpers: {
      arrayElement: jest.fn(() => TrainingTypeEnum.STRENGTH),
      arrayElements: jest.fn(() => ['gym', 'outdoor']),
    },
    lorem: {
      sentence: jest.fn(() => 'Test training session notes'),
      words: jest.fn(() => 'Test Session Name'),
    },
  },
}))

interface MockCollection {
  findOne: jest.Mock
}

describe('TrainingSession Factory', () => {
  let mockDb: jest.Mocked<Connection>
  let mockExerciseCollection: MockCollection
  let mockAthleteCollection: MockCollection

  beforeEach(() => {
    mockExerciseCollection = {
      findOne: jest.fn(),
    }
    mockAthleteCollection = {
      findOne: jest.fn(),
    }

    mockDb = {
      collection: jest.fn((name: string) => {
        if (name === 'exercises') return mockExerciseCollection
        if (name === 'athletes') return mockAthleteCollection
        return mockExerciseCollection
      }),
    } as unknown as jest.Mocked<Connection>

    jest.clearAllMocks()
  })

  describe('createTrainingSession', () => {
    it('should create a training session with default values when no session is provided', async () => {
      const mockAthlete = { _id: new ObjectId('507f1f77bcf86cd799439011') }
      const mockExercise = { _id: new ObjectId('507f1f77bcf86cd799439012') }

      mockAthleteCollection.findOne.mockResolvedValue(mockAthlete)
      mockExerciseCollection.findOne.mockResolvedValue(mockExercise)

      const result = await createTrainingSession(mockDb)

      expect(result).toMatchObject({
        athlete: mockAthlete._id,
        name: 'Test Session Name',
        date: mockDate,
        type: TrainingTypeEnum.STRENGTH,
        notes: 'Test training session notes',
        week: 3,
        month: 1,
        year: 2024,
        tags: ['gym', 'outdoor'],
      })

      expect(result.exercises).toHaveLength(3)
      expect(result.exercises[0]).toMatchObject({
        exercise: mockExercise._id,
        sets: expect.arrayContaining([
          expect.objectContaining({
            reps: 10,
            weight: 75,
            rir: 2,
          }),
        ]),
      })

      expect(mockDb.collection).toHaveBeenCalledWith('athletes')
      expect(mockDb.collection).toHaveBeenCalledWith('exercises')
    })

    it('should use provided session data when available', async () => {
      const customDate = new Date('2023-05-20')
      const customAthlete = new ObjectId('507f1f77bcf86cd799439013')

      const providedSession: Partial<TrainingSessionDTO> = {
        athlete: customAthlete,
        name: 'Test Session Name',
        date: customDate,
        type: TrainingTypeEnum.ENDURANCE,
        notes: 'Custom notes',
        week: 20,
        month: 5,
        year: 2023,
        tags: ['home'],
      }

      const result = await createTrainingSession(mockDb, providedSession)

      expect(result.athlete.toString()).toEqual(customAthlete.toString())
      expect(result.date).toEqual(customDate)
      expect(result.type).toBe(TrainingTypeEnum.ENDURANCE)
      expect(result.notes).toBe('Custom notes')
      expect(result.week).toBe(20)
      expect(result.month).toBe(5)
      expect(result.year).toBe(2023)
      expect(result.tags).toEqual(['home'])
    })

    it('should use new ObjectId for athlete when athlete is not found in database', async () => {
      const mockExercise = { _id: new ObjectId('507f1f77bcf86cd799439012') }

      mockAthleteCollection.findOne.mockResolvedValue(null)
      mockExerciseCollection.findOne.mockResolvedValue(mockExercise)

      const result = await createTrainingSession(mockDb)

      expect(result.athlete).toBeInstanceOf(ObjectId)
    })

    it('should use new ObjectId for exercise when exercise is not found in database', async () => {
      const mockAthlete = { _id: new ObjectId('507f1f77bcf86cd799439011') }

      mockAthleteCollection.findOne.mockResolvedValue(mockAthlete)
      mockExerciseCollection.findOne.mockResolvedValue(null)

      const result = await createTrainingSession(mockDb)

      expect(result.exercises[0].exercise).toBeInstanceOf(ObjectId)
    })

    it('should handle partial session data', async () => {
      const mockAthlete = { _id: new ObjectId('507f1f77bcf86cd799439011') }
      const mockExercise = { _id: new ObjectId('507f1f77bcf86cd799439012') }

      mockAthleteCollection.findOne.mockResolvedValue(mockAthlete)
      mockExerciseCollection.findOne.mockResolvedValue(mockExercise)

      const partialSession = {
        type: TrainingTypeEnum.MOBILITY,
        notes: 'Partial notes',
      }

      const result = await createTrainingSession(mockDb, partialSession)

      expect(result.type).toBe(TrainingTypeEnum.MOBILITY)
      expect(result.notes).toBe('Partial notes')
      expect(result.athlete).toBe(mockAthlete._id) // Should use database value
      expect(result.date).toBe(mockDate) // Should use faker default
    })
  })

  describe('createTrainingSessions', () => {
    it('should create default number of training sessions when length is not provided', async () => {
      const mockAthlete = { _id: new ObjectId('507f1f77bcf86cd799439011') }
      const mockExercise = { _id: new ObjectId('507f1f77bcf86cd799439012') }

      mockAthleteCollection.findOne.mockResolvedValue(mockAthlete)
      mockExerciseCollection.findOne.mockResolvedValue(mockExercise)

      const result = await createTrainingSessions(undefined, mockDb)

      expect(result).toHaveLength(5) // Default length
      result.forEach((session) => {
        expect(session).toHaveProperty('athlete')
        expect(session).toHaveProperty('date')
        expect(session).toHaveProperty('type')
        expect(session).toHaveProperty('exercises')
        expect(session.exercises).toHaveLength(3)
      })
    })

    it('should create specified number of training sessions', async () => {
      const mockAthlete = { _id: new ObjectId('507f1f77bcf86cd799439011') }
      const mockExercise = { _id: new ObjectId('507f1f77bcf86cd799439012') }

      mockAthleteCollection.findOne.mockResolvedValue(mockAthlete)
      mockExerciseCollection.findOne.mockResolvedValue(mockExercise)

      const result = await createTrainingSessions(3, mockDb)

      expect(result).toHaveLength(3)
      result.forEach((session) => {
        expect(session).toHaveProperty('athlete')
        expect(session).toHaveProperty('date')
        expect(session).toHaveProperty('type')
        expect(session).toHaveProperty('exercises')
      })
    })

    it('should create empty array when length is 0', async () => {
      const result = await createTrainingSessions(0, mockDb)

      expect(result).toHaveLength(0)
      expect(result).toEqual([])
    })
  })
})
