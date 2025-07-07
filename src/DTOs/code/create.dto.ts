import { CodeType } from '../../utils/enums/code.enum'

export interface CreateCodeDTO {
  userId: string
  code: string
  expiresAt: number
  type: CodeType
}
