import BadRequestException from '../../../src/exceptions/BadRequestException'
import disciplineMiddleware from '../../../src/middlewares/discipline.middleware'
import { createDisciplineSchema, updateDisciplineSchema } from '../../../src/schemas/discipline/discipline.schema'

jest.mock('../../../src/schemas/discipline/discipline.schema')

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
})
