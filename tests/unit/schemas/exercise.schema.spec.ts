import { createExerciseSchema, updateExerciseSchema } from '../../../src/schemas/exercise/exercise.schema'
import { MusclesEnum } from '../../../src/utils/enums/muscles.enum'
import { DifficultyEnum } from '../../../src/utils/enums/difficulty.enum'

describe('createExerciseSchema', () => {
  it('should validate a correct exercise', () => {
    const { error } = createExerciseSchema.validate({
      name: 'Bench Press',
      description: 'A classic chest exercise',
      muscles: [MusclesEnum.CHEST],
      difficulty: DifficultyEnum.EASY,
    })
    expect(error).toBeUndefined()
  })

  it('should invalidate missing required fields', () => {
    const { error } = createExerciseSchema.validate({})
    expect(error).toBeDefined()
  })

  it('should invalidate invalid muscle', () => {
    const { error } = createExerciseSchema.validate({
      name: 'Bench Press',
      description: 'A classic chest exercise',
      muscles: ['INVALID'],
      difficulty: DifficultyEnum.EASY,
    })
    expect(error).toBeDefined()
  })
})

describe('updateExerciseSchema', () => {
  it('should validate a partial update', () => {
    const { error } = updateExerciseSchema.validate({ name: 'New Name' })
    expect(error).toBeUndefined()
  })

  it('should invalidate invalid difficulty', () => {
    const { error } = updateExerciseSchema.validate({ difficulty: 'INVALID' })
    expect(error).toBeDefined()
  })
})
