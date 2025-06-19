import { Request } from 'express'
import { AuthenticatedUser } from './user.inteface'

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser
}
