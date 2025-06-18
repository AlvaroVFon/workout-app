import exerciseRepository from '../../../src/repositories/exercise.repository'
import Exercise from '../../../src/models/Exercise'
import { CreateExerciseDTO } from '../../../src/DTOs/exercise/create.dto'
import ExerciseDTO from '../../../src/DTOs/exercise/exercise.dto'
import { ObjectId } from 'mongodb'

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
      muscles: [new ObjectId(), new ObjectId()],
      description: 'mock description',
      difficulty: 'easy',
    }
    ;(Exercise.create as jest.Mock).mockResolvedValue(mockExercise)

    const result = await exerciseRepository.create(createData)

    expect(Exercise.create).toHaveBeenCalledWith(createData)
    expect(result).toEqual(mockExercise)
  })

  it('should find an exercise by ID', async () => {
    ;(Exercise.findById as jest.Mock).mockResolvedValue(mockExercise)

    const result = await exerciseRepository.findById('123')

    expect(Exercise.findById).toHaveBeenCalledWith('123', undefined)
    expect(result).toEqual(mockExercise)
  })

  it('should find one exercise by filter', async () => {
    const filter = { name: 'Push Up' }
    ;(Exercise.findOne as jest.Mock).mockResolvedValue(mockExercise)

    const result = await exerciseRepository.findOne(filter)

    expect(Exercise.findOne).toHaveBeenCalledWith(filter, undefined)
    expect(result).toEqual(mockExercise)
  })

  it('should find all exercises by query', async () => {
    const query = { muscles: 'Chest' }
    ;(Exercise.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue([mockExercise]),
    })

    const result = await exerciseRepository.findAll(query)

    expect(Exercise.find).toHaveBeenCalledWith(query, undefined)
    expect(result).toEqual([mockExercise])
  })

  it('should update an exercise', async () => {
    const updateData: Partial<ExerciseDTO> = { name: 'Updated Push Up' }
    ;(Exercise.findOneAndUpdate as jest.Mock).mockResolvedValue(mockExercise)

    const result = await exerciseRepository.update('123', updateData)

    expect(Exercise.findOneAndUpdate).toHaveBeenCalledWith({ _id: '123' }, updateData)
    expect(result).toEqual(mockExercise)
  })

  it('should delete an exercise', async () => {
    ;(Exercise.findOneAndDelete as jest.Mock).mockResolvedValue(mockExercise)

    const result = await exerciseRepository.delete('123')

    expect(Exercise.findOneAndDelete).toHaveBeenCalledWith({ _id: '123' })
    expect(result).toEqual(mockExercise)
  })
})
