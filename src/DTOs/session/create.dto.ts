export interface CreateSessionDTO {
  userId: string
  expiresAt: number
  refreshTokenHash: string
  isActive?: boolean
  replacedBy?: string
}
