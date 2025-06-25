import { createExercise } from '../../../src/factories/exercise.factory'
import { CreateExerciseDTO } from '../../../src/DTOs/exercise/create.dto'
import { MusclesEnum } from '../../../src/utils/enums/muscles.enum'

jest.mock('@faker-js/faker', () => ({
  faker: {
    lorem: {
      words: jest.fn(() => 'test exercise name'),
      paragraph: jest.fn(() => 'This is a test exercise description with multiple sentences.'),
    },
  },
}))

describe('Exercise Factory', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createExercise', () => {
    it('should create an exercise with default values when no exercise is provided', () => {
      const result = createExercise()

      expect(result).toEqual({
        name: 'test exercise name',
        description: 'This is a test exercise description with multiple sentences.',
        difficulty: 'medium',
        muscles: Object.values(MusclesEnum),
      })
    })

    it('should use provided exercise data when available', () => {
      const providedExercise: CreateExerciseDTO = {
        name: 'Custom Exercise',
        description: 'Custom description',
        difficulty: 'hard',
        muscles: [MusclesEnum.CHEST, MusclesEnum.TRICEPS],
      }

      const result = createExercise(providedExercise)

      expect(result).toEqual(providedExercise)
    })

    it('should handle partial exercise data', () => {
      const partialExercise = {
        name: 'Partial Exercise',
        difficulty: 'easy',
      } as CreateExerciseDTO

      const result = createExercise(partialExercise)

      expect(result.name).toBe('Partial Exercise')
      expect(result.difficulty).toBe('easy')
      expect(result.description).toBe('This is a test exercise description with multiple sentences.') // Should use faker default
      expect(result.muscles).toEqual(Object.values(MusclesEnum)) // Should use default
    })

    it('should create exercise with all available muscle groups by default', () => {
      const result = createExercise()

      expect(result.muscles).toEqual(Object.values(MusclesEnum))
      expect(Array.isArray(result.muscles)).toBe(true)
      expect(result.muscles.length).toBeGreaterThan(0)
    })

    it('should use medium difficulty by default', () => {
      const result = createExercise()

      expect(result.difficulty).toBe('medium')
    })

    it('should override default values with provided data', () => {
      const customExercise: CreateExerciseDTO = {
        name: 'Push-ups',
        description: 'A bodyweight exercise',
        difficulty: 'easy',
        muscles: [MusclesEnum.CHEST],
      }

      const result = createExercise(customExercise)

      expect(result.name).toBe('Push-ups')
      expect(result.description).toBe('A bodyweight exercise')
      expect(result.difficulty).toBe('easy')
      expect(result.muscles).toEqual([MusclesEnum.CHEST])
    })

    it('should handle empty muscles array when provided', () => {
      const exerciseWithEmptyMuscles: CreateExerciseDTO = {
        name: 'Test Exercise',
        description: 'Test description',
        difficulty: 'medium',
        muscles: [],
      }

      const result = createExercise(exerciseWithEmptyMuscles)

      expect(result.muscles).toEqual([])
    })
  })
})
