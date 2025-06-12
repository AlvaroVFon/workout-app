import HttpException from './HttpException'
import { StatusCode, StatusMessage } from '../utils/enums/httpResponses.enum'

class NotFoundException extends HttpException {
  constructor(message: string = StatusMessage.NOT_FOUND) {
    super(StatusCode.NOT_FOUND, message)
  }
}

export default NotFoundException
