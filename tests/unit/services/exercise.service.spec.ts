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

    it('should throw NotFoundException when muscles are not found', async () => {
      const mockExercise = {
        name: 'Push Up',
        muscles: ['muscle1', 'muscle2'],
        description: 'mock description',
        difficulty: 'easy',
      } as CreateExerciseDTO

      const mockMuscles = [
        { _id: '1', name: 'muscle1' },
        // Only one muscle found, expected 2
      ]

      ;(muscleRepository.findAll as jest.Mock).mockResolvedValue(mockMuscles)

      await expect(exerciseService.create(mockExercise)).rejects.toThrow('One or more muscles not found')
      expect(muscleRepository.findAll).toHaveBeenCalledWith({
        query: { name: { $in: ['muscle1', 'muscle2'] } },
        projection: { _id: 1 },
      })
      expect(exerciseRepository.create).not.toHaveBeenCalled()
    })

    it('should throw NotFoundException when no muscles are found', async () => {
      const mockExercise = {
        name: 'Push Up',
        muscles: ['nonexistent1', 'nonexistent2'],
        description: 'mock description',
        difficulty: 'easy',
      } as CreateExerciseDTO

      ;(muscleRepository.findAll as jest.Mock).mockResolvedValue([])

      await expect(exerciseService.create(mockExercise)).rejects.toThrow('One or more muscles not found')
      expect(muscleRepository.findAll).toHaveBeenCalledWith({
        query: { name: { $in: ['nonexistent1', 'nonexistent2'] } },
        projection: { _id: 1 },
      })
      expect(exerciseRepository.create).not.toHaveBeenCalled()
    })

    it('should throw NotFoundException when muscles is null', async () => {
      const mockExercise = {
        name: 'Push Up',
        muscles: ['muscle1'],
        description: 'mock description',
        difficulty: 'easy',
      } as CreateExerciseDTO

      ;(muscleRepository.findAll as jest.Mock).mockResolvedValue(null)

      await expect(exerciseService.create(mockExercise)).rejects.toThrow('One or more muscles not found')
      expect(exerciseRepository.create).not.toHaveBeenCalled()
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

    it('should find an exercise by ID with custom projection', async () => {
      const mockExercise = {
        _id: 'exercise1',
        name: 'Push Up',
      }
      const projection = { name: 1, difficulty: 1 }
      ;(exerciseRepository.findById as jest.Mock).mockResolvedValue(mockExercise)

      const result = await exerciseService.findById('exercise1', projection)

      expect(exerciseRepository.findById).toHaveBeenCalledWith('exercise1', projection)
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

    it('should find an exercise by filter with custom projection', async () => {
      const mockExercise = {
        _id: 'exercise1',
        name: 'Push Up',
      }
      const filter = { name: 'Push Up' }
      const projection = { name: 1, difficulty: 1 }
      ;(exerciseRepository.findOne as jest.Mock).mockResolvedValue(mockExercise)

      const result = await exerciseService.findOne(filter, projection)

      expect(exerciseRepository.findOne).toHaveBeenCalledWith(filter, projection)
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

    it('should find all exercises with default empty query', async () => {
      const mockExercises = [
        { _id: 'exercise1', name: 'Push Up', muscles: ['muscle1', 'muscle2'] },
        { _id: 'exercise2', name: 'Squat', muscles: ['muscle3', 'muscle4'] },
      ]
      ;(exerciseRepository.findAll as jest.Mock).mockResolvedValue(mockExercises)

      const result = await exerciseService.findAll()

      expect(exerciseRepository.findAll).toHaveBeenCalledWith({})
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

  describe('getTotal', () => {
    it('should get total count with query', async () => {
      const query = { difficulty: 'easy' }
      ;(exerciseRepository.getTotal as jest.Mock).mockResolvedValue(15)

      const result = await exerciseService.getTotal(query)

      expect(exerciseRepository.getTotal).toHaveBeenCalledWith(query)
      expect(result).toBe(15)
    })

    it('should get total count with default empty query', async () => {
      ;(exerciseRepository.getTotal as jest.Mock).mockResolvedValue(30)

      const result = await exerciseService.getTotal()

      expect(exerciseRepository.getTotal).toHaveBeenCalledWith({})
      expect(result).toBe(30)
    })
  })
})
