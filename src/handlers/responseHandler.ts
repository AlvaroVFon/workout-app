import { Response } from 'express'
import { ApiResponse } from '../DTOs/api/response.dto'
import logger from '../utils/logger'

function responseHandler(
  res: Response,
  statusCode: number,
  message?: string,
  data?: [] | object | string,
): Response<ApiResponse> {
  const requestInfo = {
    url: res.req?.originalUrl,
    method: res.req?.method,
  }

  logger.info(`[${new Date().toISOString()}] - ${statusCode} - ${JSON.stringify(requestInfo)} - ${message}`)

  if (statusCode === 204) {
    return res.status(statusCode).json({})
  }

  return res.status(statusCode).json({
    statusCode,
    message,
    data,
  })
}

export { responseHandler }
