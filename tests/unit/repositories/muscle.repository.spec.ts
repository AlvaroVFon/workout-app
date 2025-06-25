import muscleRepository from '../../../src/repositories/muscle.repository'
import Muscle from '../../../src/models/Muscle'
import MuscleDTO from '../../../src/DTOs/muscle/muscle.dto'

jest.mock('../../../src/models/Muscle')

describe('muscleRepository', () => {
  const mockMuscle = {
    _id: '456',
    name: 'Biceps',
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create a muscle', async () => {
    ;(Muscle.create as jest.Mock).mockResolvedValue(mockMuscle)

    const result = await muscleRepository.create('Biceps')

    expect(Muscle.create).toHaveBeenCalledWith({ name: 'Biceps' })
    expect(result).toEqual(mockMuscle)
  })

  it('should find a muscle by ID', async () => {
    ;(Muscle.findById as jest.Mock).mockResolvedValue(mockMuscle)

    const result = await muscleRepository.findById('456')

    expect(Muscle.findById).toHaveBeenCalledWith('456', undefined)
    expect(result).toEqual(mockMuscle)
  })

  it('should find a muscle by ID with projection', async () => {
    const projection = { name: 1 }
    ;(Muscle.findById as jest.Mock).mockResolvedValue(mockMuscle)

    const result = await muscleRepository.findById('456', projection)

    expect(Muscle.findById).toHaveBeenCalledWith('456', projection)
    expect(result).toEqual(mockMuscle)
  })

  it('should find one muscle by filter', async () => {
    const filter = { name: 'Biceps' }
    ;(Muscle.findOne as jest.Mock).mockResolvedValue(mockMuscle)

    const result = await muscleRepository.findOne(filter)

    expect(Muscle.findOne).toHaveBeenCalledWith(filter, undefined)
    expect(result).toEqual(mockMuscle)
  })

  it('should find one muscle by filter with projection', async () => {
    const filter = { name: 'Biceps' }
    const projection = { name: 1 }
    ;(Muscle.findOne as jest.Mock).mockResolvedValue(mockMuscle)

    const result = await muscleRepository.findOne(filter, projection)

    expect(Muscle.findOne).toHaveBeenCalledWith(filter, projection)
    expect(result).toEqual(mockMuscle)
  })

  it('should find a muscle by name', async () => {
    ;(Muscle.findOne as jest.Mock).mockResolvedValue(mockMuscle)

    const result = await muscleRepository.findByName('Biceps')

    expect(Muscle.findOne).toHaveBeenCalledWith({ name: 'Biceps' }, undefined)
    expect(result).toEqual(mockMuscle)
  })

  it('should find a muscle by name with projection', async () => {
    const projection = { name: 1 }
    ;(Muscle.findOne as jest.Mock).mockResolvedValue(mockMuscle)

    const result = await muscleRepository.findByName('Biceps', projection)

    expect(Muscle.findOne).toHaveBeenCalledWith({ name: 'Biceps' }, projection)
    expect(result).toEqual(mockMuscle)
  })

  it('should find all muscles by filter', async () => {
    const query = { name: 'Biceps' }
    ;(Muscle.find as jest.Mock).mockResolvedValue([mockMuscle])

    const result = await muscleRepository.findAll({ query })

    expect(Muscle.find).toHaveBeenCalledWith(query, {}, {})
    expect(result).toEqual([mockMuscle])
  })

  it('should find all muscles with default parameters', async () => {
    ;(Muscle.find as jest.Mock).mockResolvedValue([mockMuscle])

    const result = await muscleRepository.findAll()

    expect(Muscle.find).toHaveBeenCalledWith({}, {}, {})
    expect(result).toEqual([mockMuscle])
  })

  it('should find all muscles with projection and options', async () => {
    const query = { name: 'Biceps' }
    const projection = { name: 1 }
    const options = { sort: { name: 1 } }
    ;(Muscle.find as jest.Mock).mockResolvedValue([mockMuscle])

    const result = await muscleRepository.findAll({ query, projection, options })

    expect(Muscle.find).toHaveBeenCalledWith(query, projection, options)
    expect(result).toEqual([mockMuscle])
  })

  it('should update a muscle', async () => {
    const updateData: Partial<MuscleDTO> = { name: 'Updated Biceps' }
    ;(Muscle.findOneAndUpdate as jest.Mock).mockResolvedValue(mockMuscle)

    const result = await muscleRepository.update('456', updateData)

    expect(Muscle.findOneAndUpdate).toHaveBeenCalledWith({ _id: '456' }, updateData, { new: true })
    expect(result).toEqual(mockMuscle)
  })

  it('should delete a muscle', async () => {
    ;(Muscle.findOneAndDelete as jest.Mock).mockResolvedValue(mockMuscle)

    const result = await muscleRepository.delete('456')

    expect(Muscle.findOneAndDelete).toHaveBeenCalledWith({ _id: '456' })
    expect(result).toEqual(mockMuscle)
  })
})
