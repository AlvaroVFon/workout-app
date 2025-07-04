export interface CreateRecoveryCodeDTO {
  userId: string
  code: string
  expiresAt?: Date
}
