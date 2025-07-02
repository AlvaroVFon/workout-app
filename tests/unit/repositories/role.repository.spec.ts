import { Db, ObjectId } from 'mongodb'
import roleRepository from '../../../src/repositories/role.repository'
import { RolesEnum } from '../../../src/utils/enums/roles.enum'
import { getDb } from '../../config/setup'

const rolesCollection = 'roles'

describe('RoleRepository', () => {
  let db: Db | undefined
  beforeAll(() => {
    db = getDb()
  })

  it('should create a role', async () => {
    const role = await roleRepository.create(RolesEnum.USER)
    expect(role).toHaveProperty('_id')
    expect(role).toHaveProperty('name')
    expect(role.name).toBe(RolesEnum.USER)
  })

  it('should return a role finding by id if exist', async () => {
    const newRole = { _id: new ObjectId(), name: RolesEnum.ADMIN }
    await db?.collection(rolesCollection).insertOne(newRole)

    const foundRole = await roleRepository.findById(String(newRole._id))

    expect(foundRole).toBeDefined()
    expect(foundRole?.name).toBe(RolesEnum.ADMIN)
  })

  it('should return a role finding by name if exists', async () => {
    const newRole = { _id: new ObjectId(), name: RolesEnum.ADMIN }
    await db?.collection(rolesCollection).insertOne(newRole)

    const foundRole = await roleRepository.findOne({ name: newRole.name })

    expect(foundRole?.name).toBe(RolesEnum.ADMIN)
  })

  it('should return all roles', async () => {
    const newRoles = [
      { _id: new ObjectId(), name: RolesEnum.ADMIN },
      { _id: new ObjectId(), name: RolesEnum.USER },
    ]

    await db?.collection(rolesCollection).insertMany(newRoles)

    const roles = await roleRepository.findAll()

    expect(roles).toBeInstanceOf(Array)
    expect(roles[0].name).toBe(RolesEnum.ADMIN)
    expect(roles[1].name).toBe(RolesEnum.USER)
  })

  it('should update a role', async () => {
    const newRole = { _id: new ObjectId(), name: RolesEnum.ADMIN }
    await db?.collection(rolesCollection).insertOne(newRole)

    await roleRepository.update(String(newRole._id), {
      name: RolesEnum.SUPERADMIN,
    })

    const updatedRole = await db?.collection(rolesCollection).findOne({ _id: newRole._id })

    expect(updatedRole?.name).toBe(RolesEnum.SUPERADMIN)
  })

  it('should delete a role if exists', async () => {
    const newRole = { _id: new ObjectId(), name: RolesEnum.SUPERADMIN }
    await db?.collection(rolesCollection).insertOne(newRole)

    await roleRepository.delete(String(newRole._id))

    const deletedRole = await db?.collection(rolesCollection).findOne({ _id: newRole._id })

    expect(deletedRole).toBe(null)
  })
})
