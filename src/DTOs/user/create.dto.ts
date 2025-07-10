export interface CreateUserDTO {
  name?: string
  lastName?: string
  email: string
  role: string
  password: string //hashed password
  country?: string
  address?: string
  idDocument?: string
  createdAt?: number
  updatedAt?: number
}
