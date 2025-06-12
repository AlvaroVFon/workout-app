import { Request, Response, NextFunction } from 'express'
import userController from '../../../src/controllers/user.controller'
import userService from '../../../src/services/user.service'
import roleService from '../../../src/services/role.service'
import { responseHandler } from '../../../src/handlers/responseHandler'
import NotFoundException from '../../../src/exceptions/NotFoundException'
import { StatusCode, StatusMessage } from '../../../src/utils/enums/httpResponses.enum'

jest.mock('../../../src/services/user.service')
jest.mock('../../../src/services/role.service')
jest.mock('../../../src/handlers/responseHandler')

describe('UserController', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = { body: {}, params: {} }
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    next = jest.fn()
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a user and return the response', async () => {
      const mockRole = { _id: 'mockRole', name: 'admin' }
      const mockUser = { id: '1', name: 'John Doe', role: 'admin' }
      req.body = { name: 'John Doe', role: 'admin' }
      ;(roleService.findByName as jest.Mock).mockResolvedValue(mockRole)
      ;(userService.create as jest.Mock).mockResolvedValue(mockUser)

      await userController.create(req as Request, res as Response, next)

      expect(userService.create).toHaveBeenCalledWith(req.body)
      expect(responseHandler).toHaveBeenCalledWith(res, StatusCode.CREATED, StatusMessage.CREATED, expect.any(Object))
    })

    it('should call next with an error if creation fails', async () => {
      const error = new Error('Create failed')
      ;(userService.create as jest.Mock).mockRejectedValue(error)

      await userController.create(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [{ id: '1', name: 'John Doe', role: 'admin' }]
      ;(userService.getAll as jest.Mock).mockResolvedValue(mockUsers)

      await userController.findAll(req as Request, res as Response, next)

      expect(userService.getAll).toHaveBeenCalled()
      expect(responseHandler).toHaveBeenCalledWith(res, StatusCode.OK, StatusMessage.OK, expect.any(Array))
    })

    it('should throw NotFoundException if no users are found', async () => {
      ;(userService.getAll as jest.Mock).mockResolvedValue(null)

      await userController.findAll(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(expect.any(NotFoundException))
    })
  })

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const mockUser = { id: '1', name: 'John Doe', role: 'admin' }
      req.params!.id = '1'
      ;(userService.getById as jest.Mock).mockResolvedValue(mockUser)

      await userController.findOne(req as Request, res as Response, next)

      expect(userService.getById).toHaveBeenCalledWith('1')
      expect(responseHandler).toHaveBeenCalledWith(res, StatusCode.OK, StatusMessage.OK, expect.any(Object))
    })

    it('should throw NotFoundException if user is not found', async () => {
      req.params!.id = '1'
      ;(userService.getById as jest.Mock).mockResolvedValue(null)

      await userController.findOne(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(expect.any(NotFoundException))
    })
  })

  describe('update', () => {
    it('should update a user and return the response', async () => {
      const mockUser = { id: '1', name: 'John Updated', role: 'admin' }
      req.params!.id = '1'
      req.body = { name: 'John Updated' }
      ;(userService.update as jest.Mock).mockResolvedValue(mockUser)

      await userController.update(req as Request, res as Response, next)

      expect(userService.update).toHaveBeenCalledWith('1', req.body)
      expect(responseHandler).toHaveBeenCalledWith(res, StatusCode.OK, StatusMessage.OK, expect.any(Object))
    })

    it('should throw NotFoundException if user is not found', async () => {
      req.params!.id = '1'
      req.body = { name: 'John Updated' }
      ;(userService.update as jest.Mock).mockResolvedValue(null)

      await userController.update(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(expect.any(NotFoundException))
    })
  })

  describe('delete', () => {
    it('should delete a user and return no content', async () => {
      req.params!.id = '1'
      ;(userService.delete as jest.Mock).mockResolvedValue(true)

      await userController.delete(req as Request, res as Response, next)

      expect(userService.delete).toHaveBeenCalledWith('1')
      expect(responseHandler).toHaveBeenCalledWith(res, StatusCode.NO_CONTENT, StatusMessage.NO_CONTENT)
    })

    it('should throw NotFoundException if user is not found', async () => {
      req.params!.id = '1'
      ;(userService.delete as jest.Mock).mockResolvedValue(null)

      await userController.delete(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(expect.any(NotFoundException))
    })
  })
})
