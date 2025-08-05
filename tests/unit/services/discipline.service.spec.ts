import { DisciplineDTO } from '../../../src/DTOs/discipline/discipline.dto'
import disciplineRepository from '../../../src/repositories/discipline.repository'
import disciplineService from '../../../src/services/discipline.service'
import { DisciplineCategoryEnum } from '../../../src/utils/enums/discipline-category.enum'
import { DisciplineEnum } from '../../../src/utils/enums/discipline.enum'

jest.mock('../../../src/repositories/discipline.repository')

describe('DisciplineService', () => {
  const mockDiscipline = {
    name: 'powerlifting',
    category: [DisciplineCategoryEnum.STRENGTH],
  } as DisciplineDTO

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create a discipline', async () => {
    ;(disciplineRepository.create as jest.Mock).mockResolvedValue(mockDiscipline)
    const result = await disciplineService.createDiscipline({ ...mockDiscipline })
    expect(disciplineRepository.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'powerlifting' }))
    expect(result).toBe(mockDiscipline)
  })

  it('should find a discipline by id', async () => {
    ;(disciplineRepository.findOne as jest.Mock).mockResolvedValue(mockDiscipline)
    const result = await disciplineService.findById('someid')
    expect(disciplineRepository.findOne).toHaveBeenCalledWith({ query: { _id: 'someid' } })
    expect(result).toBe(mockDiscipline)
  })

  it('should find all disciplines', async () => {
    ;(disciplineRepository.findAll as jest.Mock).mockResolvedValue([mockDiscipline])
    const result = await disciplineService.findAll()
    expect(disciplineRepository.findAll).toHaveBeenCalled()
    expect(result).toEqual([mockDiscipline])
  })

  it('should update a discipline', async () => {
    ;(disciplineRepository.update as jest.Mock).mockResolvedValue(mockDiscipline)
    const result = await disciplineService.update('someid', { name: DisciplineEnum.POWERLIFTING })
    expect(disciplineRepository.update).toHaveBeenCalledWith(
      { _id: 'someid' },
      expect.objectContaining({ name: DisciplineEnum.POWERLIFTING }),
    )
    expect(result).toBe(mockDiscipline)
  })

  it('should delete a discipline', async () => {
    ;(disciplineRepository.delete as jest.Mock).mockResolvedValue(mockDiscipline)
    const result = await disciplineService.delete('someid')
    expect(disciplineRepository.delete).toHaveBeenCalledWith({ _id: 'someid' })
    expect(result).toBe(mockDiscipline)
  })
})
