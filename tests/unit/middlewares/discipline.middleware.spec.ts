import BadRequestException from '../../../src/exceptions/BadRequestException'
import disciplineMiddleware from '../../../src/middlewares/discipline.middleware'
import { createDisciplineSchema, updateDisciplineSchema } from '../../../src/schemas/discipline/discipline.schema'
import disciplineService from '../../../src/services/discipline.service'

jest.mock('../../../src/schemas/discipline/discipline.schema')
jest.mock('../../../src/services/discipline.service')

describe('DisciplineMiddleware', () => {
  const next = jest.fn()
  const res = {} as any

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('validateCreateDiscipline', () => {
    it('should call next with error if validation fails', async () => {
      ;(createDisciplineSchema.validate as jest.Mock).mockReturnValue({ error: { details: [{ message: 'Invalid' }] } })
      const req = { body: {} } as any
      await disciplineMiddleware.validateCreateDiscipline(req, res, next)
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestException))
    })

    it('should call next with no error if validation passes', async () => {
      ;(createDisciplineSchema.validate as jest.Mock).mockReturnValue({})
      const req = { body: { name: 'powerlifting' } } as any
      await disciplineMiddleware.validateCreateDiscipline(req, res, next)
      expect(next).toHaveBeenCalled()
    })
  })

  describe('validateUpdateDiscipline', () => {
    it('should call next with error if validation fails', async () => {
      ;(updateDisciplineSchema.validate as jest.Mock).mockReturnValue({ error: { details: [{ message: 'Invalid' }] } })
      const req = { body: {} } as any
      await disciplineMiddleware.validateUpdateDiscipline(req, res, next)
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestException))
    })

    it('should call next with no error if validation passes', async () => {
      ;(updateDisciplineSchema.validate as jest.Mock).mockReturnValue({})
      const req = { body: { name: 'powerlifting' } } as any
      await disciplineMiddleware.validateUpdateDiscipline(req, res, next)
      expect(next).toHaveBeenCalled()
    })
  })

  describe('validateDisciplinesExistence', () => {
    it('should call next with no error if all disciplines exist', async () => {
      ;(disciplineService.findById as jest.Mock).mockResolvedValue({})
      const req = { body: { disciplines: ['id1', 'id2'] } } as any
      await disciplineMiddleware.validateDisciplinesExistence(req, res, next)
      expect(next).toHaveBeenCalledWith()
    })

    it('should call next with BadRequestException if any discipline does not exist', async () => {
      ;(disciplineService.findById as jest.Mock).mockResolvedValueOnce({}).mockResolvedValueOnce(null)
      const req = { body: { disciplines: ['id1', 'id2'] } } as any
      await disciplineMiddleware.validateDisciplinesExistence(req, res, next)
      expect(next.mock.calls[0][0]).toBeInstanceOf(BadRequestException)
    })

    it('should call next with error if service throws', async () => {
      const error = new Error('fail')
      ;(disciplineService.findById as jest.Mock).mockRejectedValue(error)
      const req = { body: { disciplines: ['id1'] } } as any
      await disciplineMiddleware.validateDisciplinesExistence(req, res, next)
      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
