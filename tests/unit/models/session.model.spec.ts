import { Types } from 'mongoose'
import Session from '../../../src/models/Session'

describe('Session Model', () => {
  const mockUserId = new Types.ObjectId()
  const mockReplacedBy = new Types.ObjectId()

  describe('Schema Validation', () => {
    it('should validate required fields correctly', () => {
      const sessionData = {
        userId: mockUserId,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
        refreshTokenHash: 'hashedRefreshToken123',
        isActive: true,
      }

      const session = new Session(sessionData)
      const validationError = session.validateSync()

      expect(validationError).toBeUndefined()
    })

    it('should fail validation when userId is missing', () => {
      const sessionData = {
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        refreshTokenHash: 'someHash',
      }

      const session = new Session(sessionData)
      const validationError = session.validateSync()

      expect(validationError).toBeDefined()
      expect(validationError?.errors.userId).toBeDefined()
      expect(validationError?.errors.userId.message).toContain('required')
    })

    it('should fail validation when expiresAt is missing', () => {
      const sessionData = {
        userId: mockUserId,
        refreshTokenHash: 'someHash',
      }

      const session = new Session(sessionData)
      const validationError = session.validateSync()

      expect(validationError).toBeDefined()
      expect(validationError?.errors.expiresAt).toBeDefined()
      expect(validationError?.errors.expiresAt.message).toContain('required')
    })

    it('should fail validation when refreshTokenHash is missing', () => {
      const sessionData = {
        userId: mockUserId,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      }

      const session = new Session(sessionData)
      const validationError = session.validateSync()

      expect(validationError).toBeDefined()
      expect(validationError?.errors.refreshTokenHash).toBeDefined()
      expect(validationError?.errors.refreshTokenHash.message).toContain('required')
    })

    it('should allow replacedBy to reference another session', () => {
      const sessionData = {
        userId: mockUserId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        refreshTokenHash: 'hashedToken',
        isActive: false,
        replacedBy: mockReplacedBy,
      }

      const session = new Session(sessionData)
      const validationError = session.validateSync()

      expect(validationError).toBeUndefined()
      expect(session.replacedBy).toEqual(mockReplacedBy)
      expect(session.isActive).toBe(false)
    })
  })

  describe('Default Values', () => {
    it('should set default isActive to true when not provided', () => {
      const sessionData = {
        userId: mockUserId,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        refreshTokenHash: 'hashedToken',
      }

      const session = new Session(sessionData)

      expect(session.isActive).toBe(true)
    })

    it('should set default replacedBy to null when not provided', () => {
      const sessionData = {
        userId: mockUserId,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        refreshTokenHash: 'hashedToken',
      }

      const session = new Session(sessionData)

      expect(session.replacedBy).toBeNull()
    })
  })

  describe('Schema Structure', () => {
    it('should have correct schema paths', () => {
      const schemaPaths = Session.schema.paths

      expect(schemaPaths.userId).toBeDefined()
      expect(schemaPaths.createdAt).toBeDefined()
      expect(schemaPaths.updatedAt).toBeDefined()
      expect(schemaPaths.expiresAt).toBeDefined()
      expect(schemaPaths.refreshTokenHash).toBeDefined()
      expect(schemaPaths.isActive).toBeDefined()
      expect(schemaPaths.replacedBy).toBeDefined()
    })

    it('should have timestamps enabled', () => {
      const schemaOptions = (Session.schema as any).options

      expect(schemaOptions.timestamps).toBeDefined()
      expect(schemaOptions.timestamps).toEqual({
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
      })
    })

    it('should have TTL index configuration', () => {
      const indexes = Session.schema.indexes()
      const ttlIndex = indexes.find(
        (index) => index[0] && index[0].expiresAt === 1 && index[1]?.expireAfterSeconds === 0,
      )

      expect(ttlIndex).toBeDefined()
      expect(ttlIndex?.[1]?.expireAfterSeconds).toBe(0)
    })
  })

  describe('References', () => {
    it('should reference User model through userId', () => {
      const userIdPath = Session.schema.paths.userId as any

      expect(userIdPath.options.ref).toBe('User')
      expect(userIdPath.options.required).toBe(true)
    })

    it('should reference Session model through replacedBy', () => {
      const replacedByPath = Session.schema.paths.replacedBy as any

      expect(replacedByPath.options.ref).toBe('Session')
      expect(replacedByPath.options.default).toBeNull()
    })
  })

  describe('Field Types', () => {
    it('should have correct field types', () => {
      const sessionData = {
        userId: mockUserId,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        refreshTokenHash: 'hashedToken',
        isActive: true,
        replacedBy: mockReplacedBy,
      }

      const session = new Session(sessionData)

      expect(session.userId).toBeInstanceOf(Types.ObjectId)
      expect(typeof session.expiresAt).toBe('number')
      expect(typeof session.refreshTokenHash).toBe('string')
      expect(typeof session.isActive).toBe('boolean')
      expect(session.replacedBy).toBeInstanceOf(Types.ObjectId)
    })
  })
})
