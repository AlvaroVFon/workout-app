import { createMuscleSchema } from '../../../src/schemas/muscle/muscle.schema'
import { MusclesEnum } from '../../../src/utils/enums/muscles.enum'

describe('createMuscleSchema', () => {
  it('should validate a valid muscle', () => {
    const { error } = createMuscleSchema.validate({ name: MusclesEnum.BICEPS })
    expect(error).toBeUndefined()
  })

  it('should invalidate an invalid muscle', () => {
    const { error } = createMuscleSchema.validate({ name: 'INVALID' })
    expect(error).toBeDefined()
  })

  it('should invalidate missing name', () => {
    const { error } = createMuscleSchema.validate({})
    expect(error).toBeDefined()
  })
})
