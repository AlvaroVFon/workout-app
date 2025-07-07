import { faker } from '@faker-js/faker'
import { CreateUserDTO } from '../DTOs/user/create.dto'
import { RolesEnum } from '../utils/enums/roles.enum'

function createUser(user?: CreateUserDTO): CreateUserDTO {
  return {
    name: user?.name ?? faker.person.firstName(),
    lastName: user?.lastName ?? faker.person.lastName(),
    email: user?.email ?? faker.internet.email(),
    password: user?.password ?? faker.internet.password(),
    idDocument: user?.idDocument ?? faker.string.numeric(),
    role: user?.role ?? RolesEnum.USER,
    country: user?.country ?? faker.location.country(),
  }
}

function createAdminUser(): CreateUserDTO {
  return {
    name: 'admin',
    lastName: 'admin',
    email: 'admin@email.com',
    password: '123456Aa.',
    idDocument: '000000',
    role: RolesEnum.ADMIN,
    country: 'Spain',
    address: 'Calle de la Admin, 123',
  }
}

function createSuperAdminUser(): CreateUserDTO {
  return {
    name: 'superadmin',
    lastName: 'superadmin',
    email: 'superadmin@email.com',
    password: '123456Aa.',
    idDocument: '000000',
    role: RolesEnum.SUPERADMIN,
    country: 'Spain',
    address: 'Calle del Superadmin, 456',
  }
}

function createUsers(length: number = 5): CreateUserDTO[] {
  return Array.from({ length }, () => createUser())
}

export { createUser, createAdminUser, createSuperAdminUser, createUsers }
