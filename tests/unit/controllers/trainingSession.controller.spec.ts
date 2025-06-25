import trainingSessionController from '../../../src/controllers/trainingSession.controller'
import trainingSessionService from '../../../src/services/trainingSession.service'
import { Request, Response, NextFunction } from 'express'
import { StatusCode, StatusMessage } from '../../../src/utils/enums/httpResponses.enum'
import NotFoundException from '../../../src/exceptions/NotFoundException'
import { ObjectId } from 'mongodb'
import { TrainingTypeEnum } from '../../../src/utils/enums/trainingTypes.enum'
import { responseHandler } from '../../../src/handlers/responseHandler'
import { paginateResponse } from '../../../src/utils/pagination.utils'

// Mock dependencies
jest.mock('../../../src/services/trainingSession.service')
jest.mock('../../../src/handlers/responseHandler')
jest.mock('../../../src/utils/pagination.utils')

const mockTrainingSessionService = trainingSessionService as jest.Mocked<typeof trainingSessionService>
const mockResponseHandler = responseHandler as jest.MockedFunction<typeof responseHandler>
const mockPaginateResponse = paginateResponse as jest.MockedFunction<typeof paginateResponse>

describe('TrainingSession Controller', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext: NextFunction

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
    }
    mockResponse = {
      locals: {},
    }
    mockNext = jest.fn()

    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a training session successfully', async () => {
      const trainingSessionData = {
        athlete: new ObjectId(),
        date: new Date(),
        type: TrainingTypeEnum.STRENGTH,
        exercises: [
          {
            exercise: new ObjectId(),
            sets: [{ reps: 10, weight: 75, rir: 2 }],
          },
        ],
        notes: 'Great workout',
        week: 15,
        month: 4,
        year: 2024,
        tags: ['gym'],
      }

      const createdSession = {
        _id: new ObjectId(),
        ...trainingSessionData,
      }

      mockRequest.body = trainingSessionData
      mockTrainingSessionService.create.mockResolvedValue(createdSession as never)

      await trainingSessionController.create(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockTrainingSessionService.create).toHaveBeenCalledWith(trainingSessionData)
      expect(mockResponseHandler).toHaveBeenCalledWith(
        mockResponse,
        StatusCode.CREATED,
        StatusMessage.CREATED,
        createdSession,
      )
    })

    it('should handle service errors in create', async () => {
      const error = new Error('Service error')
      mockTrainingSessionService.create.mockRejectedValue(error)

      await trainingSessionController.create(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })

  describe('findById', () => {
    it('should find training session by id successfully', async () => {
      const sessionId = new ObjectId().toString()
      const foundSession = {
        _id: new ObjectId(),
        athlete: new ObjectId(),
        type: TrainingTypeEnum.STRENGTH,
        exercises: [],
      }

      mockRequest.params = { id: sessionId }
      mockTrainingSessionService.findOne.mockResolvedValue(foundSession as never)

      await trainingSessionController.findById(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockTrainingSessionService.findOne).toHaveBeenCalledWith({
        query: { _id: sessionId },
        projection: {},
        options: {},
      })
      expect(mockResponseHandler).toHaveBeenCalledWith(mockResponse, StatusCode.OK, StatusMessage.OK, foundSession)
    })

    it('should throw NotFoundException when session not found', async () => {
      const sessionId = new ObjectId().toString()

      mockRequest.params = { id: sessionId }
      mockTrainingSessionService.findOne.mockResolvedValue(null)

      await trainingSessionController.findById(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundException))
    })

    it('should handle service errors in findById', async () => {
      const sessionId = new ObjectId().toString()
      const error = new Error('Service error')

      mockRequest.params = { id: sessionId }
      mockTrainingSessionService.findOne.mockRejectedValue(error)

      await trainingSessionController.findById(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })

  describe('findAllByAthlete', () => {
    it('should find all training sessions by athlete with pagination', async () => {
      const athleteId = new ObjectId().toString()
      const mockSessions = [
        { _id: new ObjectId(), athlete: new ObjectId(athleteId) },
        { _id: new ObjectId(), athlete: new ObjectId(athleteId) },
      ]
      const totalSessions = 2
      const paginatedResponse = {
        documents: mockSessions,
        page: 1,
        limit: 10,
        totalPages: 1,
        total: totalSessions,
      }

      mockRequest.params = { id: athleteId }
      mockResponse.locals = {
        pagination: { page: 1, limit: 10 },
      }

      mockTrainingSessionService.findAll.mockResolvedValue(mockSessions as never)
      mockTrainingSessionService.getTotal.mockResolvedValue(totalSessions)
      mockPaginateResponse.mockReturnValue(paginatedResponse as never)

      await trainingSessionController.findAllByAthlete(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockTrainingSessionService.findAll).toHaveBeenCalledWith({
        query: { athlete: athleteId },
        projection: {},
        options: {
          populate: { path: 'athlete' },
        },
      })
      expect(mockTrainingSessionService.getTotal).toHaveBeenCalledWith({ athlete: athleteId })
      expect(mockPaginateResponse).toHaveBeenCalledWith(mockSessions, 1, 10, totalSessions, true)
      expect(mockResponseHandler).toHaveBeenCalledWith(mockResponse, StatusCode.OK, StatusMessage.OK, paginatedResponse)
    })

    it('should use default pagination values when not provided', async () => {
      const athleteId = new ObjectId().toString()
      const mockSessions: unknown[] = []
      const totalSessions = 0

      mockRequest.params = { id: athleteId }
      mockResponse.locals = {}

      mockTrainingSessionService.findAll.mockResolvedValue(mockSessions as never)
      mockTrainingSessionService.getTotal.mockResolvedValue(totalSessions)
      mockPaginateResponse.mockReturnValue({
        documents: [],
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      } as never)

      await trainingSessionController.findAllByAthlete(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockPaginateResponse).toHaveBeenCalledWith([], 1, 10, totalSessions, true)
    })

    it('should handle service errors in findAll', async () => {
      const athleteId = new ObjectId().toString()
      const error = new Error('Service error')

      mockRequest.params = { id: athleteId }
      mockResponse.locals = { pagination: { page: 1, limit: 10 } }
      mockTrainingSessionService.findAll.mockRejectedValue(error)

      await trainingSessionController.findAllByAthlete(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockNext).toHaveBeenCalledWith(error)
    })

    it('should handle empty results', async () => {
      const athleteId = new ObjectId().toString()
      const mockSessions: unknown[] = []
      const totalSessions = 0
      const paginatedResponse = {
        documents: [],
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      }

      mockRequest.params = { id: athleteId }
      mockResponse.locals = {
        pagination: { page: 1, limit: 10 },
      }

      mockTrainingSessionService.findAll.mockResolvedValue(mockSessions as never)
      mockTrainingSessionService.getTotal.mockResolvedValue(totalSessions)
      mockPaginateResponse.mockReturnValue(paginatedResponse as never)

      await trainingSessionController.findAllByAthlete(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponseHandler).toHaveBeenCalledWith(mockResponse, StatusCode.OK, StatusMessage.OK, paginatedResponse)
    })
  })
})
