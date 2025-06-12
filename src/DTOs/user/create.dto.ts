export interface CreateUserDTO {
  name: string
  lastName?: string
  email: string
  role: string
  password: string
  country?: string
  address?: string
  idDocument: string
  createdAt?: number
  updatedAt?: number
}
