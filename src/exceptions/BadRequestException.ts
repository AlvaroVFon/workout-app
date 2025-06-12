import { StatusCode, StatusMessage } from '../utils/enums/httpResponses.enum'
import HttpException from './HttpException'

class BadRequestException extends HttpException {
  constructor(message: string = StatusMessage.BAD_REQUEST) {
    super(StatusCode.BAD_REQUEST, message)
  }
}

export default BadRequestException
