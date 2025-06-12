import { Request, Response, NextFunction } from 'express'
import userService from '../services/user.service'
import { responseHandler } from '../handlers/responseHandler'
import { StatusCode, StatusMessage } from '../utils/enums/httpResponses.enum'
import NotFoundException from '../exceptions/NotFoundException'
import { UserDTO } from '../DTOs/user/user.dto'
import { UpdateUserDTO } from '../DTOs/user/update.dto'
import { ApiResponse } from '../DTOs/api/response.dto'
import { CreateUserDTO } from '../DTOs/user/create.dto'

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
      const users = await userService.getAll()

      if (!users) {
        throw new NotFoundException()
      }

      const publicUsers = users.map((user: UserDTO) => new UserDTO(user).toPublicUser())

      return responseHandler(res, StatusCode.OK, StatusMessage.OK, publicUsers)
    } catch (error) {
      next(error)
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction): Promise<Response<ApiResponse> | undefined> {
    const id = req.params.id
    try {
      const user = await userService.getById(id)

      if (!user) {
        throw new NotFoundException()
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
