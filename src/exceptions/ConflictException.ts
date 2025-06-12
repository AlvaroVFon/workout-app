import HttpException from './HttpException'
import { StatusCode, StatusMessage } from '../utils/enums/httpResponses.enum'

class ConflictException extends HttpException {
  constructor(message: string = StatusMessage.CONFLICT) {
    super(StatusCode.CONFLICT, message)
  }
}

export default ConflictException
