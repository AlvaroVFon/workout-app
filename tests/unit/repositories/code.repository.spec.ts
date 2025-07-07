import Code from '../../../src/models/Code'
import CodeRepository from '../../../src/repositories/code.repository'
import { ObjectId } from 'mongodb'

jest.mock('../../../src/models/Code')

describe('CodeRepository', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a new code', async () => {
      const mockCodeData = {
        userId: new ObjectId().toHexString(),
        code: '123456',
        expiresAt: Date.now() + 3600000,
        type: 'RECOVERY',
      }
      ;(Code.create as jest.Mock).mockResolvedValue(mockCodeData)

      const result = await CodeRepository.create(mockCodeData as any)
      expect(Code.create).toHaveBeenCalledWith(mockCodeData)
      expect(result).toEqual(mockCodeData)
    })
  })

  describe('findOne', () => {
    it('should find one code with query, projection, and options', async () => {
      const mockCode = { code: '123456', userId: new ObjectId().toHexString() }
      const mockExec = jest.fn().mockResolvedValue(mockCode)
      ;(Code.findOne as jest.Mock).mockReturnValue({ exec: mockExec })

      const query = { code: '123456' }
      const projection = { _id: 0 }
      const options = { sort: { createdAt: -1 } }

      const result = await CodeRepository.findOne({ query, projection, options })
      expect(Code.findOne).toHaveBeenCalledWith(query, projection, options)
      expect(mockExec).toHaveBeenCalled()
      expect(result).toEqual(mockCode)
    })

    it('should find one code with default parameters', async () => {
      const mockCode = { code: '123456', userId: new ObjectId().toHexString() }
      const mockExec = jest.fn().mockResolvedValue(mockCode)
      ;(Code.findOne as jest.Mock).mockReturnValue({ exec: mockExec })

      const result = await CodeRepository.findOne()
      expect(Code.findOne).toHaveBeenCalledWith({}, {}, {})
      expect(mockExec).toHaveBeenCalled()
      expect(result).toEqual(mockCode)
    })
  })

  describe('findById', () => {
    it('should find a code by ID with projection and options', async () => {
      const mockCode = { _id: new ObjectId(), code: '123456' }
      const mockExec = jest.fn().mockResolvedValue(mockCode)
      ;(Code.findById as jest.Mock).mockReturnValue({ exec: mockExec })

      const id = new ObjectId().toHexString()
      const projection = { code: 1 }
      const options = { lean: true }

      const result = await CodeRepository.findById(id, projection, options)
      expect(Code.findById).toHaveBeenCalledWith(id, projection, options)
      expect(mockExec).toHaveBeenCalled()
      expect(result).toEqual(mockCode)
    })
  })

  describe('findAll', () => {
    it('should find all codes with query, projection, and options', async () => {
      const mockCodes = [{ code: '123' }, { code: '456' }]
      const mockExec = jest.fn().mockResolvedValue(mockCodes)
      ;(Code.find as jest.Mock).mockReturnValue({ exec: mockExec })

      const query = { type: 'RECOVERY' }
      const projection = { code: 1 }
      const options = { limit: 10 }

      const result = await CodeRepository.findAll({ query, projection, options })
      expect(Code.find).toHaveBeenCalledWith(query, projection, options)
      expect(mockExec).toHaveBeenCalled()
      expect(result).toEqual(mockCodes)
    })

    it('should find all codes with default parameters', async () => {
      const mockCodes = [{ code: '123' }, { code: '456' }]
      const mockExec = jest.fn().mockResolvedValue(mockCodes)
      ;(Code.find as jest.Mock).mockReturnValue({ exec: mockExec })

      const result = await CodeRepository.findAll({})
      expect(Code.find).toHaveBeenCalledWith({}, {}, {})
      expect(mockExec).toHaveBeenCalled()
      expect(result).toEqual(mockCodes)
    })
  })

  describe('update', () => {
    it('should update a code and return the updated document', async () => {
      const mockUpdatedCode = { code: '123456', used: true }
      const mockExec = jest.fn().mockResolvedValue(mockUpdatedCode)
      ;(Code.findOneAndUpdate as jest.Mock).mockReturnValue({ exec: mockExec })

      const query = { code: '123456' }
      const updateData = { used: true }

      const result = await CodeRepository.update(query, updateData)
      expect(Code.findOneAndUpdate).toHaveBeenCalledWith(query, updateData, { new: true })
      expect(mockExec).toHaveBeenCalled()
      expect(result).toEqual(mockUpdatedCode)
    })
  })

  describe('delete', () => {
    it('should delete a code and return the deleted document', async () => {
      const mockDeletedCode = { code: '123456' }
      const mockExec = jest.fn().mockResolvedValue(mockDeletedCode)
      ;(Code.findOneAndDelete as jest.Mock).mockReturnValue({ exec: mockExec })

      const query = { code: '123456' }

      const result = await CodeRepository.delete(query)
      expect(Code.findOneAndDelete).toHaveBeenCalledWith(query)
      expect(mockExec).toHaveBeenCalled()
      expect(result).toEqual(mockDeletedCode)
    })
  })
})
