import { Request, Response, NextFunction } from 'express'
import { responseHandler } from '../handlers/responseHandler'
import trainingSessionService from '../services/trainingSession.service'
import { StatusCode, StatusMessage } from '../utils/enums/httpResponses.enum'
import { paginateResponse } from '../utils/pagination.utils'
import NotFoundException from '../exceptions/NotFoundException'

class TrainingSessionController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const exercise = await trainingSessionService.create(req.body)

      return responseHandler(res, StatusCode.CREATED, StatusMessage.CREATED, exercise)
    } catch (error) {
      next(error)
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const trainingSession = await trainingSessionService.findOne({
        query: { _id: id },
        projection: {},
        options: {},
      })

      if (!trainingSession) {
        throw new NotFoundException(`Training session with id ${id} not found`)
      }

      return responseHandler(res, StatusCode.OK, StatusMessage.OK, trainingSession)
    } catch (error) {
      next(error)
    }
  }

  async findAllByAthlete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { page = 1, limit = 10 } = res.locals.pagination
      const query = { athlete: id }

      const [trainingSessions, totalSessions] = await Promise.all([
        trainingSessionService.findAll({
          query,
          projection: {},
          options: {
            populate: { path: 'athlete' },
          },
        }),
        trainingSessionService.getTotal(query),
      ])

      const response = paginateResponse(trainingSessions, page, limit, totalSessions, true)

      return responseHandler(res, StatusCode.OK, StatusMessage.OK, response)
    } catch (error) {
      next(error)
    }
  }
}

export default new TrainingSessionController()
