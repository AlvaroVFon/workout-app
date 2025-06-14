import { Db, ObjectId } from 'mongodb'
import roleService from '../../../src/services/role.service'
import { RolesEnum } from '../../../src/utils/enums/roles.enum'
import { getDb } from '../../setup'

const collection = 'roles'

describe('roleService', () => {
  let db: Db | undefined

  beforeAll(() => {
    db = getDb()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Create --> should create a new role', async () => {
    const role = await roleService.create(RolesEnum.SUPERADMIN)

    expect(role.name).toBe(RolesEnum.SUPERADMIN)
    expect(role).toHaveProperty('__v')
    expect(role).toHaveProperty('_id')
  })

  it('FindById --> should return a role if exists', async () => {
    const newRole = { _id: new ObjectId(), name: RolesEnum.SUPERADMIN }
    await db?.collection(collection).insertOne(newRole)

    const role = await roleService.findById(String(newRole._id))

    expect(role?.name).toBe(RolesEnum.SUPERADMIN)
  })

  it('FindByName --> should return a role if exists', async () => {
    const newRole = { _id: new ObjectId(), name: RolesEnum.SUPERADMIN }
    await db?.collection(collection).insertOne(newRole)

    const role = await roleService.findByName(newRole.name)

    expect(role?.name).toBe(newRole.name)
  })

  it('FindOne --> should return a role if exists', async () => {
    const newRole = { _id: new ObjectId(), name: RolesEnum.SUPERADMIN }
    await db?.collection(collection).insertOne(newRole)

    const role = await roleService.findOne({ name: newRole.name })

    expect(role?.name).toBe(newRole.name)
  })

  it('Update --> should update a role if exists', async () => {
    const newRole = { _id: new ObjectId(), name: RolesEnum.SUPERADMIN }
    await db?.collection(collection).insertOne(newRole)

    await roleService.update(String(newRole._id), { name: RolesEnum.ADMIN })

    const role = await db?.collection(collection).findOne({ _id: newRole._id })

    expect(role?.name).toBe(RolesEnum.ADMIN)
  })

  it('Delete --> should delete a role if exists', async () => {
    const newRole = { _id: new ObjectId(), name: RolesEnum.SUPERADMIN }
    await db?.collection(collection).insertOne(newRole)

    await roleService.delete(String(newRole._id))

    const role = await db?.collection(collection).findOne({ _id: newRole._id })

    expect(role).toBe(null)
  })
})
