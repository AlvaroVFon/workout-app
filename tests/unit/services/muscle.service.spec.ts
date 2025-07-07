import MuscleDTO from '../../../src/DTOs/muscle/muscle.dto'
import muscleRepository from '../../../src/repositories/muscle.repository'
import MuscleService from '../../../src/services/muscle.service'
import { MusclesEnum } from '../../../src/utils/enums/muscles.enum'

jest.mock('../../../src/repositories/muscle.repository')

describe('MuscleService', () => {
  const mockMuscle = { id: '1', name: MusclesEnum.BICEPS } as MuscleDTO

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create a muscle', async () => {
    ;(muscleRepository.create as jest.Mock).mockResolvedValue(mockMuscle)
    const result = await MuscleService.create('Biceps')
    expect(result).toEqual(mockMuscle)
    expect(muscleRepository.create).toHaveBeenCalledWith('Biceps')
  })

  it('should find a muscle by ID', async () => {
    ;(muscleRepository.findById as jest.Mock).mockResolvedValue(mockMuscle)
    const result = await MuscleService.findById('1')
    expect(result).toEqual(mockMuscle)
    expect(muscleRepository.findById).toHaveBeenCalledWith('1', {})
  })

  it('should find a muscle by filter', async () => {
    ;(muscleRepository.findOne as jest.Mock).mockResolvedValue(mockMuscle)
    const result = await MuscleService.findOne({ name: 'Biceps' })
    expect(result).toEqual(mockMuscle)
    expect(muscleRepository.findOne).toHaveBeenCalledWith({ name: 'Biceps' }, {})
  })

  it('should find a muscle by name', async () => {
    ;(muscleRepository.findOne as jest.Mock).mockResolvedValue(mockMuscle)
    const result = await MuscleService.findByName('Biceps')
    expect(result).toEqual(mockMuscle)
    expect(muscleRepository.findOne).toHaveBeenCalledWith({ name: 'Biceps' })
  })

  it('should find all muscles', async () => {
    ;(muscleRepository.findAll as jest.Mock).mockResolvedValue([mockMuscle])
    const result = await MuscleService.findAll()
    expect(result).toEqual([mockMuscle])
    expect(muscleRepository.findAll).toHaveBeenCalled()
  })

  it('should update a muscle', async () => {
    ;(muscleRepository.update as jest.Mock).mockResolvedValue(mockMuscle)
    const result = await MuscleService.update('1', { name: MusclesEnum.TRICEPS })
    expect(result).toEqual(mockMuscle)
    expect(muscleRepository.update).toHaveBeenCalledWith('1', {
      name: 'triceps',
    })
  })

  it('should delete a muscle', async () => {
    ;(muscleRepository.delete as jest.Mock).mockResolvedValue(true)
    const result = await MuscleService.delete('1')
    expect(result).toBe(true)
    expect(muscleRepository.delete).toHaveBeenCalledWith('1')
  })
})
