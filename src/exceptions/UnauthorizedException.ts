import HttpException from './HttpException'
import { StatusCode, StatusMessage } from '../utils/enums/httpResponses.enum'

class UnauthorizedException extends HttpException {
  constructor(message: string = StatusMessage.UNAUTHORIZED) {
    super(StatusCode.UNAUTHORIZED, message)
  }
}

export default UnauthorizedException
