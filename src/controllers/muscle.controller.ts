import { Request, Response, NextFunction } from 'express'
import muscleService from '../services/muscle.service'
import { responseHandler } from '../handlers/responseHandler'
import { StatusCode, StatusMessage } from '../utils/enums/httpResponses.enum'
import NotFoundException from '../exceptions/NotFoundException'

class MuscleController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body
      const newMuscle = await muscleService.create(name)

      return responseHandler(res, StatusCode.CREATED, StatusMessage.CREATED, newMuscle)
    } catch (error) {
      next(error)
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      const muscle = await muscleService.findById(String(id))
      if (!muscle) throw new NotFoundException('Muscle not found')

      return responseHandler(res, StatusCode.OK, StatusMessage.OK, muscle)
    } catch (error) {
      next(error)
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const muscles = await muscleService.findAll()

      return responseHandler(res, StatusCode.OK, StatusMessage.OK, muscles)
    } catch (error) {
      next(error)
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const data = req.body

    try {
      const updatedMuscle = await muscleService.update(String(id), data)
      if (!updatedMuscle) throw new NotFoundException('Muscle not found')

      return responseHandler(res, StatusCode.OK, StatusMessage.OK, updatedMuscle)
    } catch (error) {
      next(error)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    try {
      const deletedMuscle = await muscleService.delete(String(id))
      if (!deletedMuscle) throw new NotFoundException('Muscle not found')

      return responseHandler(res, StatusCode.NO_CONTENT, StatusMessage.NO_CONTENT, deletedMuscle)
    } catch (error) {
      next(error)
    }
  }
}

export default new MuscleController()
