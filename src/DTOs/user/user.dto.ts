import Role from '../role/role.dto'
import { PublicUserDTO } from './user.public.dto'
class UserDTO {
  public id: string
  public name: string
  public email: string
  public password: string
  public idDocument: string
  public role: Role
  public lastName?: string
  public country?: string
  public address?: string
  public createdAt?: number
  public updatedAt?: number

  constructor(user: UserDTO) {
    this.id = user.id
    this.name = user.name
    this.email = user.email
    this.password = user.password
    this.idDocument = user.idDocument
    this.role = user.role
    this.lastName = user.lastName
    this.country = user.country
    this.address = user.address
    this.createdAt = user.createdAt
    this.updatedAt = user.updatedAt
  }

  toPublicUser(): PublicUserDTO {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      idDocument: this.idDocument,
      role: this.role.name,
      lastName: this.lastName,
      country: this.country,
      address: this.address,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}

export { UserDTO }
