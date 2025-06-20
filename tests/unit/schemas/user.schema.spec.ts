import { createUserSchema, updateUserSchema } from '../../../src/schemas/user/user.schema'
import { RolesEnum } from '../../../src/utils/enums/roles.enum'

describe('createUserSchema', () => {
  it('should validate a valid user', () => {
    const { error } = createUserSchema.validate({
      name: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: RolesEnum.USER,
      password: 'password123',
      country: 'US',
      address: '123 Main St',
      idDocument: '123456',
    })
    expect(error).toBeUndefined()
  })

  it('should invalidate missing required fields', () => {
    const { error } = createUserSchema.validate({})
    expect(error).toBeDefined()
  })

  it('should invalidate invalid email', () => {
    const { error } = createUserSchema.validate({
      name: 'John',
      email: 'not-an-email',
      role: RolesEnum.USER,
      password: 'password123',
      idDocument: '123456',
    })
    expect(error).toBeDefined()
  })
})

describe('updateUserSchema', () => {
  it('should validate a partial update', () => {
    const { error } = updateUserSchema.validate({ name: 'Jane' })
    expect(error).toBeUndefined()
  })

  it('should invalidate invalid role', () => {
    const { error } = updateUserSchema.validate({ role: 'INVALID' })
    expect(error).toBeDefined()
  })
})
