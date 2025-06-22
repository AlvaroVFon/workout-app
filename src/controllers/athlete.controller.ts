import { Request, Response, NextFunction } from 'express'
import { AuthenticatedUser } from '../interfaces/user.inteface'
import athleteService from '../services/athlete.service'
import UnauthorizedException from '../exceptions/UnauthorizedException'
import { paginateResponse } from '../utils/pagination.utils'
import { StatusCode, StatusMessage } from '../utils/enums/httpResponses.enum'
import { responseHandler } from '../handlers/responseHandler'
import NotFoundException from '../exceptions/NotFoundException'

class AthleteController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const coach = req.user as AuthenticatedUser
      if (!coach) throw new UnauthorizedException()

      const athlete = await athleteService.create(req.body, coach.id)
      return responseHandler(res, StatusCode.CREATED, StatusMessage.CREATED, athlete)
    } catch (error) {
      next(error)
    }
  }

  async findAllByCoach(req: Request, res: Response, next: NextFunction) {
    try {
      const coach = req.user as AuthenticatedUser

      const { page, limit } = res.locals.pagination
      const skip = (page - 1) * limit
      const options = { limit, skip }

      const exercises = await athleteService.findAll({ query: { coach: coach.id }, options })
      const total = await athleteService.getTotal({ coach: coach.id })

      const response = paginateResponse(exercises, page, limit, total, true)

      return responseHandler(res, StatusCode.OK, StatusMessage.OK, response)
    } catch (error) {
      next(error)
    }
  }

  async findOneByCoach(req: Request, res: Response, next: NextFunction) {
    try {
      const coach = req.user as AuthenticatedUser
      const { id } = req.params
      const athlete = await athleteService.findOne({ query: { _id: id, coach: coach.id } })

      if (!athlete) throw new NotFoundException(`Athlete with id: ${id} not found`)
      return responseHandler(res, StatusCode.OK, StatusMessage.OK, athlete)
    } catch (error) {
      next(error)
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const updateData = req.body

      const updatedAthlete = await athleteService.update(id, updateData)
      if (!updatedAthlete) throw new NotFoundException(`Athlete with id: ${id} not found`)

      return responseHandler(res, StatusCode.OK, StatusMessage.OK, updatedAthlete)
    } catch (error) {
      next(error)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      await athleteService.delete(id)

      responseHandler(res, StatusCode.NO_CONTENT, StatusMessage.NO_CONTENT)
    } catch (error) {
      next(error)
    }
  }
}

export default new AthleteController()
