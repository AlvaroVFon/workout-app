import { TokenTypeEnum } from '../utils/enums/token.enum'

export interface Payload {
  id: string
  name: string
  email: string
  idDocument?: string
  type?: TokenTypeEnum
}
