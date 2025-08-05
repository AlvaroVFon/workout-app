import { DisciplineDTO } from '../../../src/DTOs/discipline/discipline.dto'
import Discipline from '../../../src/models/Discipline'
import DisciplineRepository from '../../../src/repositories/discipline.repository'
import { DisciplineCategoryEnum } from '../../../src/utils/enums/discipline-category.enum'

jest.mock('../../../src/models/Discipline')

describe('DisciplineRepository', () => {
  const mockDiscipline = {
    name: 'powerlifting',
    categories: ['strength'],
  } as DisciplineDTO

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create a discipline', async () => {
    ;(Discipline.create as jest.Mock).mockResolvedValue(mockDiscipline)
    const result = await DisciplineRepository.create(mockDiscipline)
    expect(Discipline.create).toHaveBeenCalledWith(mockDiscipline)
    expect(result).toBe(mockDiscipline)
  })

  it('should find one discipline', async () => {
    ;(Discipline.findOne as jest.Mock).mockReturnValue({ exec: jest.fn().mockResolvedValue(mockDiscipline) })
    const result = await DisciplineRepository.findOne({ query: { name: 'powerlifting' } })
    expect(result).toBe(mockDiscipline)
  })

  it('should find all disciplines', async () => {
    ;(Discipline.find as jest.Mock).mockReturnValue({ exec: jest.fn().mockResolvedValue([mockDiscipline]) })
    const result = await DisciplineRepository.findAll()
    expect(Array.isArray(result)).toBe(true)
    expect(result[0]).toBe(mockDiscipline)
  })

  it('should update a discipline', async () => {
    ;(Discipline.findOneAndUpdate as jest.Mock).mockReturnValue({ exec: jest.fn().mockResolvedValue(mockDiscipline) })
    const result = await DisciplineRepository.update(
      { name: 'powerlifting' },
      { categories: [DisciplineCategoryEnum.STRENGTH] },
    )
    expect(result).toBe(mockDiscipline)
  })

  it('should delete a discipline', async () => {
    ;(Discipline.findOneAndDelete as jest.Mock).mockReturnValue({ exec: jest.fn().mockResolvedValue(mockDiscipline) })
    const result = await DisciplineRepository.delete({ name: 'powerlifting' })
    expect(result).toBe(mockDiscipline)
  })
})
