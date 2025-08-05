import { NextFunction, Request, Response } from 'express'
import { ApiResponse } from '../DTOs/api/response.dto'
import { DisciplineDTO } from '../DTOs/discipline/discipline.dto'
import { responseHandler } from '../handlers/responseHandler'
import disciplineService from '../services/discipline.service'
import { StatusCode, StatusMessage } from '../utils/enums/httpResponses.enum'

class DisciplineController {
  async create(req: Request, res: Response, next: NextFunction): Promise<Response<ApiResponse> | undefined> {
    try {
      const discipline: DisciplineDTO = req.body
      const createdDiscipline = await disciplineService.createDiscipline(discipline)
      return responseHandler(res, StatusCode.CREATED, StatusMessage.CREATED, createdDiscipline)
    } catch (error) {
      next(error)
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<Response<ApiResponse> | undefined> {
    try {
      const { id } = req.params
      const discipline = await disciplineService.findById(id)
      if (!discipline) {
        return responseHandler(res, StatusCode.NOT_FOUND, StatusMessage.NOT_FOUND)
      }
      return responseHandler(res, StatusCode.OK, StatusMessage.OK, discipline)
    } catch (error) {
      next(error)
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<Response<ApiResponse> | undefined> {
    try {
      const disciplines = await disciplineService.findAll()
      return responseHandler(res, StatusCode.OK, StatusMessage.OK, disciplines)
    } catch (error) {
      next(error)
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<Response<ApiResponse> | undefined> {
    try {
      const { id } = req.params
      const updatedDiscipline = await disciplineService.update(id, req.body)
      if (!updatedDiscipline) {
        return responseHandler(res, StatusCode.NOT_FOUND, StatusMessage.NOT_FOUND)
      }
      return responseHandler(res, StatusCode.OK, StatusMessage.OK, updatedDiscipline)
    } catch (error) {
      next(error)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<Response<ApiResponse> | undefined> {
    try {
      const { id } = req.params
      const deletedDiscipline = await disciplineService.delete(id)
      if (!deletedDiscipline) {
        return responseHandler(res, StatusCode.NOT_FOUND, StatusMessage.NOT_FOUND)
      }
      return responseHandler(res, StatusCode.OK, StatusMessage.OK, deletedDiscipline)
    } catch (error) {
      next(error)
    }
  }
}

export default new DisciplineController()
