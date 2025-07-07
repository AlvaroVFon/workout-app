import { CodeType } from '../../utils/enums/code.enum'

export interface CodeDTO {
  id: string
  userId: string
  code: string
  used: boolean
  createdAt: Date
  expiresAt: number
  type: CodeType
}
