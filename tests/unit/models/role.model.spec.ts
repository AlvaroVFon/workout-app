import Role from '../../../src/models/Role'

describe('Role Model', () => {
  it('Should not create a role if not included in RoleEnum', async () => {
    await expect(Role.create({ name: 'invalidRoleName' })).rejects.toThrowError(
      'Role validation failed: name: `invalidRoleName` is not a valid enum value for path `name`.',
    )
  })
})
