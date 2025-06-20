import { objectIdSchema, paginationSchema } from '../../../src/schemas/utils.schema'

describe('objectIdSchema', () => {
  it('should validate a valid ObjectId', () => {
    const { error } = objectIdSchema.validate('507f1f77bcf86cd799439011')
    expect(error).toBeUndefined()
  })

  it('should invalidate an invalid ObjectId', () => {
    const { error } = objectIdSchema.validate('invalid')
    expect(error).toBeDefined()
  })
})

describe('paginationSchema', () => {
  it('should validate with defaults', () => {
    const { value, error } = paginationSchema.validate({})
    expect(error).toBeUndefined()
    expect(value).toEqual({ page: 1, limit: 20, paginate: false })
  })

  it('should validate with custom values', () => {
    const { value, error } = paginationSchema.validate({ page: 2, limit: 5, paginate: true })
    expect(error).toBeUndefined()
    expect(value).toEqual({ page: 2, limit: 5, paginate: true })
  })

  it('should invalidate wrong types', () => {
    const { error } = paginationSchema.validate({ page: 'a' })
    expect(error).toBeDefined()
  })
})
