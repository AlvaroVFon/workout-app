export interface CreateSessionDTO {
  userId: string
  expiresAt: Date
  refreshTokenHash: string
  isActive?: boolean
  replacedBy?: string
}
