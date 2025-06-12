import HttpException from './HttpException'
import { StatusCode, StatusMessage } from '../utils/enums/httpResponses.enum'

class InternalServerErrorException extends HttpException {
  constructor() {
    super(StatusCode.INTERNAL_SERVER_ERROR, StatusMessage.INTERNAL_SERVER_ERROR)
  }
}

export default InternalServerErrorException
