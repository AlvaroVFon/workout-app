import { ObjectId } from 'mongodb'
import { createSignupData, handleMaxAttempts } from '../../../src/helpers/auth.helper'
import attemptService from '../../../src/services/attempt.service'
import { AttemptsEnum } from '../../../src/utils/enums/attempts.enum'

jest.mock('../../../src/services/attempt.service')

describe('Auth Helper', () => {
  describe('createSignupData', () => {
    it('should create signup data with hashed password', async () => {
      const mockData = {
        email: 'test@rmail.com',
        password: 'password123',
      }

      const signupData = await createSignupData(mockData.email, mockData.password)
      expect(signupData).toHaveProperty('id')
      expect(signupData.signupCredentials).toHaveProperty('email', mockData.email)
      expect(signupData.signupCredentials).toHaveProperty('password')
      expect(signupData.signupCredentials.password).not.toBe(mockData.password)
    })

    it('should create unique ID for signup data', async () => {
      const mockData1 = {
        email: 'test1@email.com',
        password: 'password123',
      }

      const mockData2 = {
        email: 'test2@email.com',
        password: 'password456',
      }

      const signupData1 = await createSignupData(mockData1.email, mockData1.password)
      const signupData2 = await createSignupData(mockData2.email, mockData2.password)

      expect(signupData1.id).not.toBe(signupData2.id)
      expect(signupData1.signupCredentials.email).toBe(mockData1.email)
      expect(signupData2.signupCredentials.email).toBe(mockData2.email)
      expect(signupData1.signupCredentials.password).not.toBe(mockData1.password)
      expect(signupData2.signupCredentials.password).not.toBe(mockData2.password)
    })

    it('should handle empty email and password', async () => {
      const mockData = {
        email: '',
        password: '',
      }

      await expect(createSignupData(mockData.email, mockData.password)).rejects.toThrow()
    })
  })

  describe('handleMaxAttempts', () => {
    it('should return true if max attempts are reached', async () => {
      const mockData = { id: new ObjectId(), maxAttempts: 5, type: AttemptsEnum.LOGIN }
      jest.mocked(attemptService.isMaxLoginAttemptsReached).mockResolvedValue(true)

      await expect(handleMaxAttempts(mockData.id.toString(), mockData.maxAttempts, mockData.type)).resolves.toBe(true)
    })

    it('should return false if max attempts are not reached', async () => {
      const mockData = { id: new ObjectId(), maxAttempts: 5, type: AttemptsEnum.LOGIN }
      jest.mocked(attemptService.isMaxLoginAttemptsReached).mockResolvedValue(false)
      await expect(handleMaxAttempts(mockData.id.toString(), mockData.maxAttempts, mockData.type)).resolves.toBe(false)
    })

    it('should call attemptService.isMaxLoginAttemptsReached with correct parameters', async () => {
      const mockData = { id: new ObjectId(), maxAttempts: 5, type: AttemptsEnum.LOGIN }
      jest.mocked(attemptService.isMaxLoginAttemptsReached).mockResolvedValue(false)

      await handleMaxAttempts(mockData.id.toString(), mockData.maxAttempts, mockData.type)

      expect(attemptService.isMaxLoginAttemptsReached).toHaveBeenCalledWith(
        mockData.id.toString(),
        mockData.maxAttempts,
        mockData.type,
      )
    })

    it('should handle errors from attemptService.isMaxLoginAttemptsReached', async () => {
      const mockData = { id: new ObjectId(), maxAttempts: 5, type: AttemptsEnum.LOGIN }
      jest.mocked(attemptService.isMaxLoginAttemptsReached).mockRejectedValue(new Error('Service error'))

      await expect(handleMaxAttempts(mockData.id.toString(), mockData.maxAttempts, mockData.type)).rejects.toThrow(
        'Service error',
      )
    })
  })
})
