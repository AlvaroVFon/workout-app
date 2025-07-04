import HttpException from './HttpException'
import { StatusCode, StatusMessage } from '../utils/enums/httpResponses.enum'

class TooManyRequestException extends HttpException {
  constructor(message: string = StatusMessage.TOO_MANY_REQUESTS) {
    super(StatusCode.TOO_MANY_REQUESTS, message)
  }
}

export default TooManyRequestException
