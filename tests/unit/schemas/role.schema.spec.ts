import { createRoleSchema } from '../../../src/schemas/role/role.schema'
import { RolesEnum } from '../../../src/utils/enums/roles.enum'

describe('createRoleSchema', () => {
  it('should validate a valid role', () => {
    const { error } = createRoleSchema.validate({ name: RolesEnum.USER })
    expect(error).toBeUndefined()
  })

  it('should invalidate an invalid role', () => {
    const { error } = createRoleSchema.validate({ name: 'INVALID' })
    expect(error).toBeDefined()
  })

  it('should invalidate missing name', () => {
    const { error } = createRoleSchema.validate({})
    expect(error).toBeDefined()
  })
})
