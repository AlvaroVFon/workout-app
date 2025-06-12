import roleController from '../../../src/controllers/role.controller'
import roleService from '../../../src/services/role.service'
import { responseHandler } from '../../../src/handlers/responseHandler'
import { StatusCode, StatusMessage } from '../../../src/utils/enums/httpResponses.enum'
import { Request, Response, NextFunction } from 'express'
import NotFoundException from '../../../src/exceptions/NotFoundException'

jest.mock('../../../src/services/role.service')
jest.mock('../../../src/handlers/responseHandler')

describe('RoleController', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = { body: { name: 'Admin' }, query: { id: '1' } }
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    next = jest.fn()
  })

  it('should create a new role and return success response', async () => {
    const mockRole = { id: 1, name: 'Admin' }

    ;(roleService.create as jest.Mock).mockResolvedValue(mockRole)

    await roleController.create(req as Request, res as Response, next)

    expect(roleService.create).toHaveBeenCalledWith('Admin')
    expect(responseHandler).toHaveBeenCalledWith(res, StatusCode.CREATED, StatusMessage.CREATED, mockRole)
  })

  it('should call next with an error if role creation fails', async () => {
    const mockError = new Error('Role creation failed')
    ;(roleService.create as jest.Mock).mockRejectedValue(mockError)

    await roleController.create(req as Request, res as Response, next)

    expect(next).toHaveBeenCalledWith(mockError)
  })

  it('should find a role by ID and return success response', async () => {
    const mockRole = { id: 1, name: 'Admin' }
    ;(roleService.findById as jest.Mock).mockResolvedValue(mockRole)

    await roleController.findById(req as Request, res as Response, next)

    expect(roleService.findById).toHaveBeenCalledWith('1')
    expect(responseHandler).toHaveBeenCalledWith(res, StatusCode.OK, StatusMessage.OK, mockRole)
  })

  it('should throw NotFoundException if role is not found', async () => {
    ;(roleService.findById as jest.Mock).mockResolvedValue(null)

    await roleController.findById(req as Request, res as Response, next)

    expect(roleService.findById).toHaveBeenCalledWith('1')
    expect(next).toHaveBeenCalledWith(new NotFoundException('Role with id:1 not found'))
  })

  it('should call next with an error if service fails', async () => {
    const mockError = new Error('Service error')
    ;(roleService.findById as jest.Mock).mockRejectedValue(mockError)

    await roleController.findById(req as Request, res as Response, next)

    expect(next).toHaveBeenCalledWith(mockError)
  })

  it('should update a role and return success response', async () => {
    req = { query: { id: '1' }, body: { name: 'Updated Role' } }
    const mockUpdatedRole = { id: 1, name: 'Updated Role' }
    ;(roleService.update as jest.Mock).mockResolvedValue(mockUpdatedRole)

    await roleController.update(req as Request, res as Response, next)

    expect(roleService.update).toHaveBeenCalledWith('1', {
      name: 'Updated Role',
    })
    expect(responseHandler).toHaveBeenCalledWith(res, StatusCode.OK, StatusMessage.OK, mockUpdatedRole)
  })

  it('should throw NotFoundException if role is not found', async () => {
    req = { query: { id: '1' }, body: { name: 'Updated Role' } }
    ;(roleService.update as jest.Mock).mockResolvedValue(null)

    await roleController.update(req as Request, res as Response, next)

    expect(roleService.update).toHaveBeenCalledWith('1', {
      name: 'Updated Role',
    })
    expect(next).toHaveBeenCalledWith(new NotFoundException('Role with id:1 not found'))
  })

  it('should call next with an error if service fails', async () => {
    const mockError = new Error('Service error')
    ;(roleService.update as jest.Mock).mockRejectedValue(mockError)

    await roleController.update(req as Request, res as Response, next)

    expect(next).toHaveBeenCalledWith(mockError)
  })

  it('should delete a role and return no content response', async () => {
    ;(roleService.delete as jest.Mock).mockResolvedValue(true)

    await roleController.delete(req as Request, res as Response, next)

    expect(roleService.delete).toHaveBeenCalledWith('1')
    expect(responseHandler).toHaveBeenCalledWith(res, StatusCode.NO_CONTENT)
  })

  it('should throw NotFoundException if role is not found', async () => {
    ;(roleService.delete as jest.Mock).mockResolvedValue(null)

    await roleController.delete(req as Request, res as Response, next)

    expect(roleService.delete).toHaveBeenCalledWith('1')
    expect(next).toHaveBeenCalledWith(new NotFoundException('Role with id:1 not found'))
  })

  it('should call next with an error if service fails', async () => {
    const mockError = new Error('Service error')
    ;(roleService.delete as jest.Mock).mockRejectedValue(mockError)

    await roleController.delete(req as Request, res as Response, next)

    expect(next).toHaveBeenCalledWith(mockError)
  })
})
