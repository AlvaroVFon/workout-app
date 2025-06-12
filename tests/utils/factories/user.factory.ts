import { faker } from '@faker-js/faker'
import { CreateUserDTO } from '../../../src/DTOs/user/create.dto'

const userFactory = (user?: CreateUserDTO): CreateUserDTO => ({
  name: user?.name ?? faker.person.firstName(),
  email: user?.email ?? faker.internet.email(),
  idDocument: user?.idDocument ?? faker.string.numeric(8),
  password: user?.password ?? faker.internet.password(),
  createdAt: Date.now(),
  updatedAt: Date.now(),
})

export { userFactory }
