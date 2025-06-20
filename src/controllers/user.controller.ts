import { Request, Response, NextFunction } from 'express'
import userService from '../services/user.service'
import { responseHandler } from '../handlers/responseHandler'
import { StatusCode, StatusMessage } from '../utils/enums/httpResponses.enum'
import NotFoundException from '../exceptions/NotFoundException'
import { UserDTO } from '../DTOs/user/user.dto'
import { UpdateUserDTO } from '../DTOs/user/update.dto'
import { ApiResponse } from '../DTOs/api/response.dto'
import { CreateUserDTO } from '../DTOs/user/create.dto'
import { paginateResponse } from '../utils/pagination.utils'

class UserController {
  async create(req: Request, res: Response, next: NextFunction): Promise<Response<ApiResponse> | undefined> {
    const data: CreateUserDTO = req.body

    try {
      const user = await userService.create(data)
      const publicUser = new UserDTO(user).toPublicUser()

      return responseHandler(res, StatusCode.CREATED, StatusMessage.CREATED, publicUser)
    } catch (error) {
      next(error)
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<Response<ApiResponse> | undefined> {
    try {
      const { page, limit } = res.locals.pagination
      const skip = (page - 1) * limit
      const options = { limit, skip }

      const users = await userService.findAll({ options })
      const total = await userService.getTotal()

      const publicUsers = users.map((user: UserDTO) => new UserDTO(user).toPublicUser())
      const response = paginateResponse(publicUsers, page, limit, total, true)

      return responseHandler(res, StatusCode.OK, StatusMessage.OK, response)
    } catch (error) {
      next(error)
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction): Promise<Response<ApiResponse> | undefined> {
    const id = req.params.id
    try {
      const user = await userService.findById(id)

      if (!user) {
        throw new NotFoundException(`User with id: ${id} not found`)
      }

      const publicUser = new UserDTO(user).toPublicUser()
      return responseHandler(res, StatusCode.OK, StatusMessage.OK, publicUser)
    } catch (error) {
      next(error)
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<Response<ApiResponse> | undefined> {
    const id = req.params.id
    const data: UpdateUserDTO = req.body

    try {
      const updatedUser = await userService.update(id, data)

      if (!updatedUser) {
        throw new NotFoundException()
      }

      const publicUpdatedUser = new UserDTO(updatedUser).toPublicUser()

      return responseHandler(res, StatusCode.OK, StatusMessage.OK, publicUpdatedUser)
    } catch (error) {
      next(error)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<Response<ApiResponse> | undefined> {
    const id = req.params.id

    try {
      const deletedUser = await userService.delete(id)

      if (!deletedUser) {
        throw new NotFoundException()
      }

      return responseHandler(res, StatusCode.NO_CONTENT, StatusMessage.NO_CONTENT)
    } catch (error) {
      next(error)
    }
  }
}

export default new UserController()
