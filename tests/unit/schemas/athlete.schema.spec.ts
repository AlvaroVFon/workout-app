import {
  createAthleteSchema,
  updateAthleteDisciplineSchema,
  updateAthleteSchema,
} from '../../../src/schemas/athlete/athlete.schema'
import { GenderEnum } from '../../../src/utils/enums/gender.enum'

describe('athlete.schema', () => {
  describe('createAthleteSchema', () => {
    it('should validate a valid athlete', () => {
      const valid = {
        email: 'athlete@example.com',
        firstname: 'Jane',
        lastname: 'Doe',
        gender: GenderEnum.FEMALE,
        height: 170,
        weight: 65,
        goals: ['Run 10k'],
        notes: 'Test',
        idDocument: 'ID123',
        phone: '+612345678',
      }
      const { error } = createAthleteSchema.validate(valid)
      expect(error).toBeUndefined()
    })

    it('should fail if required fields are missing', () => {
      const invalid = { firstname: 'Jane' }
      const { error } = createAthleteSchema.validate(invalid)
      expect(error).toBeDefined()
    })

    it('should fail if gender is invalid', () => {
      const invalid = {
        email: 'athlete@example.com',
        firstname: 'Jane',
        lastname: 'Doe',
        gender: 'invalid',
        idDocument: 'ID123',
      }
      const { error } = createAthleteSchema.validate(invalid)
      expect(error).toBeDefined()
    })
  })

  describe('updateAthleteSchema', () => {
    it('should validate a valid update', () => {
      const valid = { firstname: 'Updated' }
      const { error } = updateAthleteSchema.validate(valid)
      expect(error).toBeUndefined()
    })

    it('should fail if a field is invalid', () => {
      const invalid = { height: 0 }
      const { error } = updateAthleteSchema.validate(invalid)
      expect(error).toBeDefined()
    })
  })

  describe('updateAthleteDisciplineSchema', () => {
    it('should validate valid disciplines array', () => {
      const valid = { disciplines: ['507f1f77bcf86cd799439011'] }
      const { error } = updateAthleteDisciplineSchema.validate(valid)
      expect(error).toBeUndefined()
    })

    it('should fail if disciplines is not an array of valid ObjectIds', () => {
      const invalid = { disciplines: ['invalid_id'] }
      const { error } = updateAthleteDisciplineSchema.validate(invalid)
      expect(error).toBeDefined()
    })
  })
})
