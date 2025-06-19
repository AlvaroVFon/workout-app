import HttpException from './HttpException'
import { StatusCode, StatusMessage } from '../utils/enums/httpResponses.enum'

class ForbiddenException extends HttpException {
  constructor(message: string = StatusMessage.FORBIDDEN) {
    super(StatusCode.FORBIDDEN, message)
  }
}

export default ForbiddenException
