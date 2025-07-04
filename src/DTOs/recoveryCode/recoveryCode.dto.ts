export interface RecoveryCodeDTO {
  id: string
  userId: string
  code: string
  used: boolean
  createdAt: Date
  expiresAt?: Date
}
