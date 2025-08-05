import { NextFunction, Request, Response } from 'express'
import disciplineController from '../../../src/controllers/discipline.controller'
import { DisciplineDTO } from '../../../src/DTOs/discipline/discipline.dto'
import disciplineService from '../../../src/services/discipline.service'
import { DisciplineCategoryEnum } from '../../../src/utils/enums/discipline-category.enum'
import { DisciplineEnum } from '../../../src/utils/enums/discipline.enum'
import { StatusCode } from '../../../src/utils/enums/httpResponses.enum'

jest.mock('../../../src/services/discipline.service')

const mockResponse = () => {
  const res: Partial<Response> = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res as Response
}

describe('DisciplineController', () => {
  const mockDiscipline = {
    id: 'disciplineId',
    name: DisciplineEnum.POWERLIFTING,
    categories: [DisciplineCategoryEnum.STRENGTH],
  } as DisciplineDTO

  const next: NextFunction = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create a discipline', async () => {
    ;(disciplineService.createDiscipline as jest.Mock).mockResolvedValue(mockDiscipline)
    const req = { body: mockDiscipline } as Request
    const res = mockResponse()
    await disciplineController.create(req, res, next)
    expect(disciplineService.createDiscipline).toHaveBeenCalledWith(mockDiscipline)
    expect(res.status).toHaveBeenCalledWith(StatusCode.CREATED)
    expect(res.json).toHaveBeenCalled()
  })

  it('should find a discipline by id', async () => {
    ;(disciplineService.findById as jest.Mock).mockResolvedValue(mockDiscipline)
    const req = { params: { id: 'someid' } } as unknown as Request
    const res = mockResponse()
    await disciplineController.findById(req, res, next)
    expect(disciplineService.findById).toHaveBeenCalledWith('someid')
    expect(res.status).toHaveBeenCalledWith(StatusCode.OK)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return NOT_FOUND if discipline not found by id', async () => {
    ;(disciplineService.findById as jest.Mock).mockResolvedValue(null)
    const req = { params: { id: 'someid' } } as unknown as Request
    const res = mockResponse()
    await disciplineController.findById(req, res, next)
    expect(res.status).toHaveBeenCalledWith(StatusCode.NOT_FOUND)
    expect(res.json).toHaveBeenCalled()
  })

  it('should find all disciplines', async () => {
    ;(disciplineService.findAll as jest.Mock).mockResolvedValue([mockDiscipline])
    const req = {} as Request
    const res = mockResponse()
    await disciplineController.findAll(req, res, next)
    expect(disciplineService.findAll).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(StatusCode.OK)
    expect(res.json).toHaveBeenCalled()
  })

  it('should update a discipline', async () => {
    ;(disciplineService.update as jest.Mock).mockResolvedValue(mockDiscipline)
    const req = { params: { id: 'someid' }, body: { name: DisciplineEnum.POWERLIFTING } } as unknown as Request
    const res = mockResponse()
    await disciplineController.update(req, res, next)
    expect(disciplineService.update).toHaveBeenCalledWith('someid', { name: DisciplineEnum.POWERLIFTING })
    expect(res.status).toHaveBeenCalledWith(StatusCode.OK)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return NOT_FOUND if discipline not found on update', async () => {
    ;(disciplineService.update as jest.Mock).mockResolvedValue(null)
    const req = { params: { id: 'someid' }, body: { name: DisciplineEnum.POWERLIFTING } } as unknown as Request
    const res = mockResponse()
    await disciplineController.update(req, res, next)
    expect(res.status).toHaveBeenCalledWith(StatusCode.NOT_FOUND)
    expect(res.json).toHaveBeenCalled()
  })

  it('should delete a discipline', async () => {
    ;(disciplineService.delete as jest.Mock).mockResolvedValue(mockDiscipline)
    const req = { params: { id: 'someid' } } as unknown as Request
    const res = mockResponse()
    await disciplineController.delete(req, res, next)
    expect(disciplineService.delete).toHaveBeenCalledWith('someid')
    expect(res.status).toHaveBeenCalledWith(StatusCode.OK)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return NOT_FOUND if discipline not found on delete', async () => {
    ;(disciplineService.delete as jest.Mock).mockResolvedValue(null)
    const req = { params: { id: 'someid' } } as unknown as Request
    const res = mockResponse()
    await disciplineController.delete(req, res, next)
    expect(res.status).toHaveBeenCalledWith(StatusCode.NOT_FOUND)
    expect(res.json).toHaveBeenCalled()
  })
})
