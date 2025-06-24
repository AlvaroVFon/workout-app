import {
  createTrainingSessionSchema,
  updateTrainingSessionSchema,
} from '../../../src/schemas/trainingSession/trainingSession.schema'
import { TrainingTypeEnum } from '../../../src/utils/enums/trainingTypes.enum'

describe('trainingSession.schema', () => {
  const validSet = { reps: 10, weight: 50, rir: 2 }
  const validExercise = { exercise: '60c72b2f9b1e8e6d88f1e8e6', sets: [validSet] }
  const validSession = {
    athlete: '60c72b2f9b1e8e6d88f1e8e7',
    date: new Date(),
    type: TrainingTypeEnum.STRENGTH,
    exercises: [validExercise],
    perceivedEffort: 7,
    notes: 'Good session',
    sessionDuration: 60,
    tags: ['upper', 'push'],
  }

  describe('createTrainingSessionSchema', () => {
    it('should validate a valid session', () => {
      const { error } = createTrainingSessionSchema.validate(validSession)
      expect(error).toBeUndefined()
    })
    it('should fail if required fields are missing', () => {
      const { error } = createTrainingSessionSchema.validate({})
      expect(error).toBeDefined()
    })
    it('should fail if type is invalid', () => {
      const invalid = { ...validSession, type: 'invalid' }
      const { error } = createTrainingSessionSchema.validate(invalid)
      expect(error).toBeDefined()
    })
    it('should fail if exercises is empty', () => {
      const invalid = { ...validSession, exercises: [] }
      const { error } = createTrainingSessionSchema.validate(invalid)
      expect(error).toBeDefined()
    })
  })

  describe('updateTrainingSessionSchema', () => {
    it('should validate a valid update', () => {
      const { error } = updateTrainingSessionSchema.validate({ notes: 'Updated' })
      expect(error).toBeUndefined()
    })
    it('should fail if update is empty', () => {
      const { error } = updateTrainingSessionSchema.validate({})
      expect(error).toBeDefined()
    })
  })
})
