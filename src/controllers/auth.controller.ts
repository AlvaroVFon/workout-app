import ms from 'ms'
import { NextFunction, Request, Response } from 'express'
import { ApiResponse } from '../DTOs/api/response.dto'
import { UserDTO } from '../DTOs/user/user.dto'
import UnauthorizedException from '../exceptions/UnauthorizedException'
import { responseHandler } from '../handlers/responseHandler'
import { handleHttpCookie } from '../helpers/auth.helper'
import authService from '../services/auth.service'
import { StatusCode, StatusMessage } from '../utils/enums/httpResponses.enum'
import BadRequestException from '../exceptions/BadRequestException'
import { parameters } from '../config/parameters'

const jwtRefreshExpiration = Number(ms(parameters.jwtRefreshExpiration))

class AuthController {
  async signUp(req: Request, res: Response, next: NextFunction): Promise<Response<ApiResponse> | undefined> {
    const { email, password } = req.body

    try {
      await authService.signup(email, password)

      return responseHandler(res, StatusCode.NO_CONTENT, StatusMessage.NO_CONTENT)
    } catch (error) {
      next(error)
    }
  }

  async signupVerification(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ApiResponse> | undefined> {
    const { code } = req.body
    const { uuid } = req.params

    try {
      const isVerified = await authService.signupVerification(uuid, code)

      if (!isVerified) {
        throw new BadRequestException('Invalid code')
      }

      return responseHandler(res, StatusCode.CREATED, StatusMessage.CREATED)
    } catch (error) {
      next(error)
    }
  }

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
      }

      await handleHttpCookie('x-refresh-token', response.refreshToken, jwtRefreshExpiration, res)

      return responseHandler(res, StatusCode.OK, StatusMessage.OK, loginResponse)
    } catch (error) {
      next(error)
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<Response<ApiResponse> | undefined> {
    const { email } = req.body

    try {
      await authService.forgotPassword(email)
      return responseHandler(res, StatusCode.NO_CONTENT, StatusMessage.NO_CONTENT)
    } catch (error) {
      next(error)
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<Response<ApiResponse> | undefined> {
    try {
      const { code, password } = req.body
      const { token } = req.params

      const isPasswordReset = await authService.resetPassword(String(token), code, password)
      if (!isPasswordReset) {
        throw new BadRequestException('Invalid code or email')
      }

      return responseHandler(res, StatusCode.NO_CONTENT, StatusMessage.NO_CONTENT)
    } catch (error) {
      next(error)
    }
  }

  async info(req: Request, res: Response): Promise<Response<ApiResponse> | undefined> {
    return responseHandler(res, StatusCode.OK, StatusMessage.OK, req.user)
  }

  async refreshTokens(req: Request, res: Response, next: NextFunction): Promise<Response<ApiResponse> | undefined> {
    try {
      const refreshTokenFromCookie = req.cookies['x-refresh-token']

      const tokens = await authService.refreshTokens(refreshTokenFromCookie)

      if (!tokens?.token || !tokens?.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token')
      }

      await handleHttpCookie('x-refresh-token', tokens.refreshToken, jwtRefreshExpiration, res)
      return responseHandler(res, StatusCode.OK, StatusMessage.OK, { token: tokens.token })
    } catch (error) {
      next(error)
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<Response<ApiResponse> | undefined> {
    const refreshToken = req.cookies['x-refresh-token'] as string
    try {
      const isSessionClosed = await authService.logout(refreshToken)
      if (!isSessionClosed) throw new UnauthorizedException('Invalid session or token')

      handleHttpCookie('x-refresh-token', '', 0, res)

      return responseHandler(res, StatusCode.NO_CONTENT, StatusMessage.NO_CONTENT)
    } catch (error) {
      next(error)
    }
  }
}

export default new AuthController()
