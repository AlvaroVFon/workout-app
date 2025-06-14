import { NextFunction, Request, Response } from 'express'
import roleService from '../services/role.service'
import { responseHandler } from '../handlers/responseHandler'
import { StatusCode, StatusMessage } from '../utils/enums/httpResponses.enum'
import NotFoundException from '../exceptions/NotFoundException'

class RoleController {
  async create(req: Request, res: Response, next: NextFunction) {
    const { name } = req.body

    try {
      const newRole = await roleService.create(name)
      return responseHandler(res, StatusCode.CREATED, StatusMessage.CREATED, newRole)
    } catch (error) {
      next(error)
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    try {
      const role = await roleService.findById(String(id))
      if (!role) throw new NotFoundException(`Role with id:${id} not found`)

      return responseHandler(res, StatusCode.OK, StatusMessage.OK, role)
    } catch (error) {
      next(error)
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await roleService.findAll()
      return responseHandler(res, StatusCode.OK, StatusMessage.OK, roles)
    } catch (error) {
      next(error)
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const data = req.body

    try {
      const updatedRole = await roleService.update(String(id), data)
      if (!updatedRole) throw new NotFoundException(`Role with id:${id} not found`)

      return responseHandler(res, StatusCode.OK, StatusMessage.OK, updatedRole)
    } catch (error) {
      next(error)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    try {
      const deletedRole = await roleService.delete(String(id))
      if (!deletedRole) throw new NotFoundException(`Role with id:${id} not found`)

      return responseHandler(res, StatusCode.NO_CONTENT)
    } catch (error) {
      next(error)
    }
  }
}

export default new RoleController()
