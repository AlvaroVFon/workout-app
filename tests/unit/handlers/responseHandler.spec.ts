import { Response } from 'express'
import { responseHandler } from '../../../src/handlers/responseHandler'
import logger from '../../../src/utils/logger'

jest.mock('../../../src/utils/logger')

describe('responseHandler', () => {
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      req: {
        url: '/test-url',
        method: 'GET',
      } as any,
    }
  })

  it('should log the response details and return the correct response', () => {
    const statusCode = 200
    const message = 'Success'
    const data = { key: 'value' }

    responseHandler(mockResponse as Response, statusCode, message, data)

    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(`[${new Date().toISOString().slice(0, 10)}`))

    expect(mockResponse.status).toHaveBeenCalledWith(statusCode)
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode,
      message,
      data,
    })
  })

  it('should handle undefined data gracefully', () => {
    const statusCode = 404
    const message = 'Not Found'

    responseHandler(mockResponse as Response, statusCode, message)

    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode,
      message,
      data: undefined,
    })
  })
})
