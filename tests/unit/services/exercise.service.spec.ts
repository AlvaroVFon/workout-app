import exerciseService from '../../../src/services/exercise.service'
import exerciseRepository from '../../../src/repositories/exercise.repository'
import muscleRepository from '../../../src/repositories/muscle.repository'
import { CreateExerciseDTO } from '../../../src/DTOs/exercise/create.dto'

jest.mock('../../../src/repositories/exercise.repository')
jest.mock('../../../src/repositories/muscle.repository')

describe('ExerciseService', () => {
  describe('create', () => {
    it('should create an exercise with muscle IDs', async () => {
      const mockExercise = {
        name: 'Push Up',
        muscles: ['muscle1', 'muscle2'],
        description: 'mock description',
        difficulty: 'easy',
      } as CreateExerciseDTO

      const mockMuscles = [
        { _id: '1', name: 'muscle1' },
        { _id: '2', name: 'muscle2' },
      ]

      ;(muscleRepository.findAll as jest.Mock).mockResolvedValue(mockMuscles)
      ;(exerciseRepository.create as jest.Mock).mockResolvedValue({
        ...mockExercise,
        muscles: ['1', '2'],
      })

      const result = await exerciseService.create(mockExercise)

      expect(muscleRepository.findAll).toHaveBeenCalledWith({
        query: { name: { $in: ['muscle1', 'muscle2'] } },
        projection: { _id: 1 },
      })
      expect(exerciseRepository.create).toHaveBeenCalledWith({
        ...mockExercise,
        muscles: ['1', '2'],
      })
      expect(result).toEqual({
        ...mockExercise,
        muscles: ['1', '2'],
      })
    })
  })

  describe('findById', () => {
    it('should find an exercise by ID', async () => {
      const mockExercise = {
        _id: 'exercise1',
        name: 'Push Up',
        muscles: ['muscle1', 'muscle2'],
      }
      ;(exerciseRepository.findById as jest.Mock).mockResolvedValue(mockExercise)

      const result = await exerciseService.findById('exercise1')

      expect(exerciseRepository.findById).toHaveBeenCalledWith('exercise1', {})
      expect(result).toEqual(mockExercise)
    })
  })

  describe('findOne', () => {
    it('should find an exercise by filter', async () => {
      const mockExercise = {
        _id: 'exercise1',
        name: 'Push Up',
        muscles: ['muscle1', 'muscle2'],
      }
      const filter = { name: 'Push Up' }
      ;(exerciseRepository.findOne as jest.Mock).mockResolvedValue(mockExercise)

      const result = await exerciseService.findOne(filter)

      expect(exerciseRepository.findOne).toHaveBeenCalledWith(filter, {})
      expect(result).toEqual(mockExercise)
    })
  })

  describe('findByName', () => {
    it('should find an exercise by name', async () => {
      const mockExercise = {
        _id: 'exercise1',
        name: 'Push Up',
        muscles: ['muscle1', 'muscle2'],
      }
      ;(exerciseRepository.findOne as jest.Mock).mockResolvedValue(mockExercise)

      const result = await exerciseService.findByName('Push Up')

      expect(exerciseRepository.findOne).toHaveBeenCalledWith({
        name: 'Push Up',
      })
      expect(result).toEqual(mockExercise)
    })
  })

  describe('findAll', () => {
    it('should find all exercises matching the query', async () => {
      const mockExercises = [
        { _id: 'exercise1', name: 'Push Up', muscles: ['muscle1', 'muscle2'] },
        { _id: 'exercise2', name: 'Squat', muscles: ['muscle3', 'muscle4'] },
      ]
      const query = { name: { $regex: '.*' } }
      ;(exerciseRepository.findAll as jest.Mock).mockResolvedValue(mockExercises)

      const result = await exerciseService.findAll({ query })

      expect(exerciseRepository.findAll).toHaveBeenCalledWith({ query })
      expect(result).toEqual(mockExercises)
    })
  })

  describe('update', () => {
    it('should update an exercise by ID', async () => {
      const mockExercise = {
        _id: 'exercise1',
        name: 'Push Up',
        muscles: ['muscle1', 'muscle2'],
      }
      const updateData = { name: 'Updated Push Up' }
      ;(exerciseRepository.update as jest.Mock).mockResolvedValue({
        ...mockExercise,
        ...updateData,
      })

      const result = await exerciseService.update('exercise1', updateData)

      expect(exerciseRepository.update).toHaveBeenCalledWith('exercise1', updateData)
      expect(result).toEqual({ ...mockExercise, ...updateData })
    })
  })

  describe('delete', () => {
    it('should delete an exercise by ID', async () => {
      const mockExerciseId = 'exercise1'
      ;(exerciseRepository.delete as jest.Mock).mockResolvedValue(true)

      const result = await exerciseService.delete(mockExerciseId)

      expect(exerciseRepository.delete).toHaveBeenCalledWith(mockExerciseId)
      expect(result).toBe(true)
    })
  })
})
