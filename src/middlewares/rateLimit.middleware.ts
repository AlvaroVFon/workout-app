import { NextFunction, Request, Response } from 'express'
import rateLimit from 'express-rate-limit'
import { parameters } from '../config/parameters'
import TooManyRequestException from '../exceptions/TooManyRequestException'

const limiter = rateLimit({
  windowMs: parameters.rateLimitWindow,
  max: parameters.rateLimitMax,
  handler: handleRateLimitError,
})

function handleRateLimitError(req: Request, res: Response, next: NextFunction) {
  next(new TooManyRequestException())
}

export { limiter }
