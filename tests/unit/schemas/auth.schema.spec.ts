import { loginSchema } from '../../../src/schemas/auth/auth.schema'

describe('loginSchema', () => {
  it('should validate a valid login', () => {
    const { error } = loginSchema.validate({
      email: 'test@example.com',
      password: 'password123',
    })
    expect(error).toBeUndefined()
  })

  it('should invalidate missing fields', () => {
    const { error } = loginSchema.validate({ email: 'test@example.com' })
    expect(error).toBeDefined()
  })

  it('should invalidate invalid email', () => {
    const { error } = loginSchema.validate({
      email: 'not-an-email',
      password: 'password123',
    })
    expect(error).toBeDefined()
  })
})
