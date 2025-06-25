import exerciseRepository from '../../../src/repositories/exercise.repository'
import Exercise from '../../../src/models/Exercise'
import { CreateExerciseDTO } from '../../../src/DTOs/exercise/create.dto'
import ExerciseDTO from '../../../src/DTOs/exercise/exercise.dto'

jest.mock('../../../src/models/Exercise')

describe('ExerciseRepository', () => {
  const mockExercise = {
    _id: '123',
    name: 'Push Up',
    muscles: ['Chest', 'Triceps'],
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create an exercise', async () => {
    const createData: CreateExerciseDTO = {
      name: 'Push Up',
      muscles: ['muscle1', 'muscle2'],
      description: 'mock description',
      difficulty: 'easy',
    }
    ;(Exercise.create as jest.Mock).mockResolvedValue(mockExercise)

    const result = await exerciseRepository.create(createData)

    expect(Exercise.create).toHaveBeenCalledWith(createData)
    expect(result).toEqual(mockExercise)
  })

  it('should find an exercise by ID', async () => {
    ;(Exercise.findById as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockExercise),
    })

    const result = await exerciseRepository.findById('123')

    expect(Exercise.findById).toHaveBeenCalledWith('123', undefined)
    expect(result).toEqual(mockExercise)
  })

  it('should find an exercise by ID with projection', async () => {
    const projection = { name: 1, muscles: 1 }
    ;(Exercise.findById as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockExercise),
    })

    const result = await exerciseRepository.findById('123', projection)

    expect(Exercise.findById).toHaveBeenCalledWith('123', projection)
    expect(result).toEqual(mockExercise)
  })

  it('should find one exercise by filter', async () => {
    const filter = { name: 'Push Up' }
    ;(Exercise.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockExercise),
    })

    const result = await exerciseRepository.findOne(filter)

    expect(Exercise.findOne).toHaveBeenCalledWith(filter, undefined)
    expect(result).toEqual(mockExercise)
  })

  it('should find one exercise by filter with projection', async () => {
    const filter = { name: 'Push Up' }
    const projection = { name: 1, difficulty: 1 }
    ;(Exercise.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockExercise),
    })

    const result = await exerciseRepository.findOne(filter, projection)

    expect(Exercise.findOne).toHaveBeenCalledWith(filter, projection)
    expect(result).toEqual(mockExercise)
  })

  it('should find all exercises by query', async () => {
    const query = { muscles: 'Chest' }
    ;(Exercise.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue([mockExercise]),
    })

    const result = await exerciseRepository.findAll({ query })

    expect(Exercise.find).toHaveBeenCalledWith(query, {}, {})
    expect(result).toEqual([mockExercise])
  })

  it('should find all exercises with default empty parameters', async () => {
    ;(Exercise.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue([mockExercise]),
    })

    const result = await exerciseRepository.findAll()

    expect(Exercise.find).toHaveBeenCalledWith({}, {}, {})
    expect(result).toEqual([mockExercise])
  })

  it('should find all exercises with projection and options', async () => {
    const query = { muscles: 'Chest' }
    const projection = { name: 1, difficulty: 1 }
    const options = { sort: { name: 1 }, limit: 5 }
    ;(Exercise.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue([mockExercise]),
    })

    const result = await exerciseRepository.findAll({ query, projection, options })

    expect(Exercise.find).toHaveBeenCalledWith(query, projection, options)
    expect(result).toEqual([mockExercise])
  })

  it('should update an exercise', async () => {
    const updateData: Partial<ExerciseDTO> = { name: 'Updated Push Up' }
    ;(Exercise.findOneAndUpdate as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockExercise),
    })

    const result = await exerciseRepository.update('123', updateData)

    expect(Exercise.findOneAndUpdate).toHaveBeenCalledWith({ _id: '123' }, updateData, { new: true })
    expect(result).toEqual(mockExercise)
  })

  it('should delete an exercise', async () => {
    ;(Exercise.findOneAndDelete as jest.Mock).mockResolvedValue(mockExercise)

    const result = await exerciseRepository.delete('123')

    expect(Exercise.findOneAndDelete).toHaveBeenCalledWith({ _id: '123' })
    expect(result).toEqual(mockExercise)
  })

  it('should get total count with query', async () => {
    const query = { muscles: 'Chest' }
    ;(Exercise.countDocuments as jest.Mock).mockResolvedValue(10)

    const result = await exerciseRepository.getTotal(query)

    expect(Exercise.countDocuments).toHaveBeenCalledWith(query)
    expect(result).toBe(10)
  })

  it('should get total count with default empty query', async () => {
    ;(Exercise.countDocuments as jest.Mock).mockResolvedValue(25)

    const result = await exerciseRepository.getTotal()

    expect(Exercise.countDocuments).toHaveBeenCalledWith({})
    expect(result).toBe(25)
  })
})
