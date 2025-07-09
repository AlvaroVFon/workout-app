import CodeService from '../../../src/services/code.service'
import codeRepository from '../../../src/repositories/code.repository'
import { generateCode } from '../../../src/utils/codeGenerator.utils'
import { CodeType } from '../../../src/utils/enums/code.enum'

jest.mock('../../../src/repositories/code.repository')
jest.mock('../../../src/utils/codeGenerator.utils')
jest.mock('../../../src/config/parameters', () => ({
  parameters: {
    codeExpiration: 3600000, // 1 hour
  },
}))

describe('CodeService', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a new code with correct parameters', async () => {
      const mockUserId = 'user123'
      const mockCode = 'ABCDEF'
      const mockCodeData = {
        userId: mockUserId,
        code: mockCode,
        expiresAt: expect.any(Number),
        type: CodeType.RECOVERY,
      }

      ;(generateCode as jest.Mock).mockReturnValue(mockCode)
      ;(codeRepository.create as jest.Mock).mockResolvedValue(mockCodeData)

      const result = await CodeService.create(mockUserId, CodeType.RECOVERY)

      expect(generateCode).toHaveBeenCalledWith(6)
      expect(codeRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUserId,
          code: mockCode,
          type: CodeType.RECOVERY,
          expiresAt: expect.any(Number),
        }),
      )
      expect(result).toEqual(mockCodeData)
    })
  })

  describe('findLastByUserIdAndType', () => {
    it('should find the last code by user ID and type', async () => {
      const mockUserId = 'user123'
      const mockCode = { userId: mockUserId, type: CodeType.RECOVERY, used: false, createdAt: Date.now() }
      ;(codeRepository.findOne as jest.Mock).mockResolvedValue(mockCode)

      const result = await CodeService.findLastByUserIdAndType(mockUserId, CodeType.RECOVERY)

      expect(codeRepository.findOne).toHaveBeenCalledWith({
        query: { userId: mockUserId, type: CodeType.RECOVERY, used: false },
        options: { sort: { createdAt: -1 } },
      })
      expect(result).toEqual(mockCode)
    })
  })

  describe('isCodeValid', () => {
    it('should return true if code is valid and not expired', async () => {
      const mockCode = 'ABCDEF'
      const mockUserId = 'user123'
      const mockCodeData = { expiresAt: Date.now() + 10000, CodeType: CodeType.RECOVERY, used: false }
      ;(codeRepository.findOne as jest.Mock).mockResolvedValue(mockCodeData)

      const result = await CodeService.isCodeValid(mockCode, mockUserId, CodeType.RECOVERY)

      expect(codeRepository.findOne).toHaveBeenCalledWith({
        query: { code: mockCode, userId: mockUserId, used: false, type: CodeType.RECOVERY },
        projection: { expiresAt: 1 },
      })
      expect(result).toBe(true)
    })

    it('should return false if code is expired', async () => {
      const mockCode = 'ABCDEF'
      const mockUserId = 'user123'
      const mockCodeData = { expiresAt: Date.now() - 10000, tupe: CodeType.RECOVERY, used: false }
      ;(codeRepository.findOne as jest.Mock).mockResolvedValue(mockCodeData)

      const result = await CodeService.isCodeValid(mockCode, mockUserId, CodeType.RECOVERY)

      expect(result).toBe(false)
    })

    it('should return false if code is not found', async () => {
      const mockCode = 'ABCDEF'
      const mockUserId = 'user123'
      ;(codeRepository.findOne as jest.Mock).mockResolvedValue(null)

      const result = await CodeService.isCodeValid(mockCode, mockUserId, CodeType.RECOVERY)

      expect(result).toBe(false)
    })
  })

  describe('invalidateCode', () => {
    it('should invalidate the code', async () => {
      const mockCode = 'ABCDEF'
      const mockUserId = 'user123'
      const mockUpdatedCode = { code: mockCode, used: true }
      ;(codeRepository.update as jest.Mock).mockResolvedValue(mockUpdatedCode)

      const result = await CodeService.invalidateCode(mockCode, mockUserId)

      expect(codeRepository.update).toHaveBeenCalledWith({ userId: mockUserId, code: mockCode }, { used: true })
      expect(result).toEqual(mockUpdatedCode)
    })
  })
})
