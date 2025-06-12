import { errorHandler } from '../../../src/handlers/errorHandler'
import HttpException from '../../../src/exceptions/HttpException'
import { Request, Response, NextFunction } from 'express'
import logger from '../../../src/utils/logger'

jest.mock('../../../src/utils/logger')

describe('errorHandler', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext: NextFunction
  let statusMock: jest.Mock
  let jsonMock: jest.Mock

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis()
    jsonMock = jest.fn()
    mockRequest = {
      url: '/test-url',
      method: 'GET',
    }
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    }
    mockNext = jest.fn()
  })

  it('should log the error and return the correct response', () => {
    const error = new HttpException(404, 'Not Found')

    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext)

    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('404'))
    expect(statusMock).toHaveBeenCalledWith(404)
    expect(jsonMock).toHaveBeenCalledWith({
      statusCode: 404,
      error: 'Not Found',
    })
  })
})
