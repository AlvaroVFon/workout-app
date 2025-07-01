import { Db, ObjectId } from 'mongodb'
import roleService from '../../../src/services/role.service'
import { RolesEnum } from '../../../src/utils/enums/roles.enum'
import { getDb } from '../../config/setup'

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

  it('FindAll --> should return all roles with default empty query', async () => {
    // Insert some test roles
    const testRoles = [
      { _id: new ObjectId(), name: RolesEnum.ADMIN },
      { _id: new ObjectId(), name: RolesEnum.USER },
    ]
    await db?.collection(collection).insertMany(testRoles)

    const roles = await roleService.findAll()

    expect(Array.isArray(roles)).toBe(true)
    expect(roles.length).toBeGreaterThanOrEqual(2)
  })

  it('FindAll --> should return roles matching query', async () => {
    const testRole = { _id: new ObjectId(), name: RolesEnum.USER }
    await db?.collection(collection).insertOne(testRole)

    const roles = await roleService.findAll({ query: { name: RolesEnum.USER } })

    expect(Array.isArray(roles)).toBe(true)
    expect(roles.some((role) => role.name === RolesEnum.USER)).toBe(true)
  })

  it('FindOne --> should return a role with custom projection', async () => {
    const newRole = { _id: new ObjectId(), name: RolesEnum.SUPERADMIN }
    await db?.collection(collection).insertOne(newRole)

    const role = await roleService.findOne({ name: newRole.name }, { name: 1 })

    expect(role?.name).toBe(newRole.name)
    expect(role).toHaveProperty('_id')
  })
})
