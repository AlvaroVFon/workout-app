import { NextFunction, Request, Response } from 'express'
import { ApiResponse } from '../DTOs/api/response.dto'
import { UserDTO } from '../DTOs/user/user.dto'
import UnauthorizedException from '../exceptions/UnauthorizedException'
import { responseHandler } from '../handlers/responseHandler'
import authService from '../services/auth.service'
import userService from '../services/user.service'
import { StatusCode, StatusMessage } from '../utils/enums/httpResponses.enum'

class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<Response<ApiResponse> | undefined> {
    try {
      const { email, password } = req.body
      const response = await authService.login(email, password)

      if (!response) {
        throw new UnauthorizedException()
      }

      const publicUser = new UserDTO(response.user).toPublicUser()
      const loginResponse = {
        user: publicUser,
        token: response.token,
        refreshToken: response.refreshToken,
      }

      return responseHandler(res, StatusCode.OK, StatusMessage.OK, loginResponse)
    } catch (error) {
      next(error)
    }
  }

  async signUp(req: Request, res: Response, next: NextFunction): Promise<Response<ApiResponse> | undefined> {
    const data = req.body

    try {
      const user = await userService.create(data)
      const publicUser = new UserDTO(user).toPublicUser()

      return responseHandler(res, StatusCode.CREATED, StatusMessage.CREATED, publicUser)
    } catch (error) {
      next(error)
    }
  }

  async info(req: Request, res: Response): Promise<Response<ApiResponse> | undefined> {
    return responseHandler(res, StatusCode.OK, StatusMessage.OK, req.user)
  }

  async refreshTokens(req: Request, res: Response, next: NextFunction): Promise<Response<ApiResponse> | undefined> {
    try {
      const { refreshToken } = req.body

      const tokens = await authService.refreshTokens(refreshToken)

      if (!tokens) {
        throw new UnauthorizedException('Invalid refresh token')
      }

      return responseHandler(res, StatusCode.OK, StatusMessage.OK, tokens)
    } catch (error) {
      next(error)
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<Response<ApiResponse> | undefined> {
    const refreshToken = req.headers['x-refresh-token'] as string
    try {
      const isSessionClosed = await authService.logout(refreshToken)
      if (!isSessionClosed) throw new UnauthorizedException('Invalid session or token')

      return responseHandler(res, StatusCode.NO_CONTENT, StatusMessage.NO_CONTENT)
    } catch (error) {
      next(error)
    }
  }
}

export default new AuthController()
