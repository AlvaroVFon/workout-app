import { checkCollectionExistence } from '../../../src/utils/database.utils'
import { Connection } from 'mongoose'
import { CollectionInfo } from 'mongodb'

describe('Database Utils', () => {
  let mockConnection: jest.Mocked<Connection>

  beforeEach(() => {
    jest.clearAllMocks()

    mockConnection = {
      listCollections: jest.fn(),
    } as unknown as jest.Mocked<Connection>
  })

  describe('checkCollectionExistence', () => {
    it('should return true when collection exists', async () => {
      const mockCollections: CollectionInfo[] = [
        { name: 'users', type: 'collection' } as CollectionInfo,
        { name: 'athletes', type: 'collection' } as CollectionInfo,
        { name: 'exercises', type: 'collection' } as CollectionInfo,
      ]

      mockConnection.listCollections.mockResolvedValue(mockCollections)

      const result = await checkCollectionExistence(mockConnection, 'users')

      expect(result).toBe(true)
      expect(mockConnection.listCollections).toHaveBeenCalledTimes(1)
    })

    it('should return false when collection does not exist', async () => {
      const mockCollections: CollectionInfo[] = [
        { name: 'athletes', type: 'collection' } as CollectionInfo,
        { name: 'exercises', type: 'collection' } as CollectionInfo,
      ]

      mockConnection.listCollections.mockResolvedValue(mockCollections)

      const result = await checkCollectionExistence(mockConnection, 'users')

      expect(result).toBe(false)
      expect(mockConnection.listCollections).toHaveBeenCalledTimes(1)
    })

    it('should return false when no collections exist', async () => {
      const mockCollections: CollectionInfo[] = []

      mockConnection.listCollections.mockResolvedValue(mockCollections)

      const result = await checkCollectionExistence(mockConnection, 'users')

      expect(result).toBe(false)
      expect(mockConnection.listCollections).toHaveBeenCalledTimes(1)
    })

    it('should be case-sensitive when checking collection names', async () => {
      const mockCollections: CollectionInfo[] = [
        { name: 'Users', type: 'collection' } as CollectionInfo,
        { name: 'athletes', type: 'collection' } as CollectionInfo,
      ]

      mockConnection.listCollections.mockResolvedValue(mockCollections)

      const result = await checkCollectionExistence(mockConnection, 'users')

      expect(result).toBe(false)
      expect(mockConnection.listCollections).toHaveBeenCalledTimes(1)
    })

    it('should find collection with exact name match', async () => {
      const mockCollections: CollectionInfo[] = [
        { name: 'user', type: 'collection' } as CollectionInfo,
        { name: 'users', type: 'collection' } as CollectionInfo,
        { name: 'usernames', type: 'collection' } as CollectionInfo,
      ]

      mockConnection.listCollections.mockResolvedValue(mockCollections)

      const result = await checkCollectionExistence(mockConnection, 'users')

      expect(result).toBe(true)
      expect(mockConnection.listCollections).toHaveBeenCalledTimes(1)
    })

    it('should handle collections with special characters in names', async () => {
      const mockCollections: CollectionInfo[] = [
        { name: 'training-sessions', type: 'collection' } as CollectionInfo,
        { name: 'user_profiles', type: 'collection' } as CollectionInfo,
        { name: 'exercise.logs', type: 'collection' } as CollectionInfo,
      ]

      mockConnection.listCollections.mockResolvedValue(mockCollections)

      const result1 = await checkCollectionExistence(mockConnection, 'training-sessions')
      const result2 = await checkCollectionExistence(mockConnection, 'user_profiles')
      const result3 = await checkCollectionExistence(mockConnection, 'exercise.logs')

      expect(result1).toBe(true)
      expect(result2).toBe(true)
      expect(result3).toBe(true)
      expect(mockConnection.listCollections).toHaveBeenCalledTimes(3)
    })

    it('should handle empty collection name search', async () => {
      const mockCollections: CollectionInfo[] = [
        { name: '', type: 'collection' } as CollectionInfo,
        { name: 'users', type: 'collection' } as CollectionInfo,
      ]

      mockConnection.listCollections.mockResolvedValue(mockCollections)

      const result = await checkCollectionExistence(mockConnection, '')

      expect(result).toBe(true)
      expect(mockConnection.listCollections).toHaveBeenCalledTimes(1)
    })

    it('should handle collections with different types', async () => {
      const mockCollections: CollectionInfo[] = [
        { name: 'users', type: 'collection' } as CollectionInfo,
        { name: 'logs', type: 'view' } as CollectionInfo,
        { name: 'system.indexes', type: 'index' } as CollectionInfo,
      ]

      mockConnection.listCollections.mockResolvedValue(mockCollections)

      const result1 = await checkCollectionExistence(mockConnection, 'users')
      const result2 = await checkCollectionExistence(mockConnection, 'logs')
      const result3 = await checkCollectionExistence(mockConnection, 'system.indexes')

      expect(result1).toBe(true)
      expect(result2).toBe(true)
      expect(result3).toBe(true)
      expect(mockConnection.listCollections).toHaveBeenCalledTimes(3)
    })

    it('should handle database connection errors', async () => {
      const error = new Error('Database connection failed')
      mockConnection.listCollections.mockRejectedValue(error)

      await expect(checkCollectionExistence(mockConnection, 'users')).rejects.toThrow('Database connection failed')
      expect(mockConnection.listCollections).toHaveBeenCalledTimes(1)
    })

    it('should handle listCollections returning null or undefined', async () => {
      // @ts-expect-error Testing null case
      mockConnection.listCollections.mockResolvedValue(null)

      await expect(checkCollectionExistence(mockConnection, 'users')).rejects.toThrow()
      expect(mockConnection.listCollections).toHaveBeenCalledTimes(1)
    })

    it('should handle large number of collections efficiently', async () => {
      // Create a mock with 1000 collections
      const mockCollections: CollectionInfo[] = Array.from(
        { length: 1000 },
        (_, index) =>
          ({
            name: `collection_${index}`,
            type: 'collection',
          }) as CollectionInfo,
      )

      // Add our target collection in the middle
      mockCollections[500] = { name: 'target_collection', type: 'collection' } as CollectionInfo

      mockConnection.listCollections.mockResolvedValue(mockCollections)

      const result = await checkCollectionExistence(mockConnection, 'target_collection')

      expect(result).toBe(true)
      expect(mockConnection.listCollections).toHaveBeenCalledTimes(1)
    })

    it('should handle collections with minimal CollectionInfo properties', async () => {
      const mockCollections: Partial<CollectionInfo>[] = [{ name: 'users' }, { name: 'athletes' }]

      mockConnection.listCollections.mockResolvedValue(mockCollections as CollectionInfo[])

      const result = await checkCollectionExistence(mockConnection, 'users')

      expect(result).toBe(true)
      expect(mockConnection.listCollections).toHaveBeenCalledTimes(1)
    })

    it('should handle whitespace in collection names', async () => {
      const mockCollections: CollectionInfo[] = [
        { name: ' users ', type: 'collection' } as CollectionInfo,
        { name: 'athletes', type: 'collection' } as CollectionInfo,
      ]

      mockConnection.listCollections.mockResolvedValue(mockCollections)

      const result1 = await checkCollectionExistence(mockConnection, ' users ')
      const result2 = await checkCollectionExistence(mockConnection, 'users')

      expect(result1).toBe(true)
      expect(result2).toBe(false) // Exact match required
      expect(mockConnection.listCollections).toHaveBeenCalledTimes(2)
    })
  })
})
