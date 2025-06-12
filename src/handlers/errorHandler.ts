import HttpException from '../exceptions/HttpException'
import { NextFunction, Request, Response } from 'express'
import { ErrorResponse } from '../DTOs/api/errorResponse.dto'
import logger from '../utils/logger'

export const errorHandler = (
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction,
): Response<ErrorResponse> => {
  const statusCode = err.status || 500
  const message = err.message || 'Internal Server Error'
  const requestInfo = {
    url: req.url,
    method: req.method,
  }

  logger.error(`[${new Date().toISOString()}] - ${statusCode} - ${JSON.stringify(requestInfo)} - ${message}`)

  return res.status(statusCode).json({
    statusCode,
    error: message,
  })
}
