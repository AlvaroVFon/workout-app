import { jwtStrategy } from '../../../src/strategies/jwt.strategy'
import userService from '../../../src/services/user.service'
import { Types } from 'mongoose'
import { UserDTO } from '../../../src/DTOs/user/user.dto'

jest.mock('../../../src/services/user.service')

const mockUserService = userService as jest.Mocked<typeof userService>

interface JwtPayload {
  id: string
}

interface MockRequest {
  headers: {
    authorization?: string
  }
}

type VerifyCallback = (
  payload: JwtPayload,
  done: (error: Error | null, user?: UserDTO | false) => void,
) => Promise<void>
type JwtFromRequestCallback = (request: MockRequest) => string | null

describe('JWT Strategy', () => {
  const mockDone = jest.fn()
  const mockUser: UserDTO = {
    id: new Types.ObjectId().toString(),
    email: 'test@example.com',
    name: 'Test User',
    idDocument: '12345678',
    password: 'hashedPassword',
    role: {
      id: new Types.ObjectId().toString(),
      name: 'user',
    },
    toPublicUser: jest.fn(),
  } as UserDTO

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should authenticate user successfully when valid payload is provided', async () => {
    const payload: JwtPayload = { id: mockUser.id }
    mockUserService.findById.mockResolvedValue(mockUser)

    // Directly test the verify callback function
    const verifyCallback = (jwtStrategy as unknown as { _verify: VerifyCallback })._verify
    await verifyCallback(payload, mockDone)

    expect(mockUserService.findById).toHaveBeenCalledWith(payload.id)
    expect(mockDone).toHaveBeenCalledWith(null, {
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      idDocument: mockUser.idDocument,
      role: mockUser.role.name,
    })
  })

  it('should return false when user is not found', async () => {
    const payload: JwtPayload = { id: new Types.ObjectId().toString() }
    mockUserService.findById.mockResolvedValue(null)

    const verifyCallback = (jwtStrategy as unknown as { _verify: VerifyCallback })._verify
    await verifyCallback(payload, mockDone)

    expect(mockUserService.findById).toHaveBeenCalledWith(payload.id)
    expect(mockDone).toHaveBeenCalledWith(null, false)
  })

  it('should handle errors from user service', async () => {
    const payload: JwtPayload = { id: new Types.ObjectId().toString() }
    const error = new Error('Database connection error')
    mockUserService.findById.mockRejectedValue(error)

    const verifyCallback = (jwtStrategy as unknown as { _verify: VerifyCallback })._verify
    await verifyCallback(payload, mockDone)

    expect(mockUserService.findById).toHaveBeenCalledWith(payload.id)
    expect(mockDone).toHaveBeenCalledWith(error, false)
  })

  it('should handle user service throwing synchronous errors', async () => {
    const payload: JwtPayload = { id: new Types.ObjectId().toString() }
    const error = new Error('Synchronous error')
    mockUserService.findById.mockImplementation(() => {
      throw error
    })

    const verifyCallback = (jwtStrategy as unknown as { _verify: VerifyCallback })._verify
    await verifyCallback(payload, mockDone)

    expect(mockUserService.findById).toHaveBeenCalledWith(payload.id)
    expect(mockDone).toHaveBeenCalledWith(error, false)
  })

  it('should extract JWT from Authorization header', () => {
    const mockRequest: MockRequest = {
      headers: {
        authorization: 'Bearer valid-jwt-token',
      },
    }

    const jwtFromRequest = (jwtStrategy as unknown as { _jwtFromRequest: JwtFromRequestCallback })._jwtFromRequest
    const extractedToken = jwtFromRequest(mockRequest)

    expect(extractedToken).toBe('valid-jwt-token')
  })

  it('should return null when no Authorization header is present', () => {
    const mockRequest: MockRequest = {
      headers: {},
    }

    const jwtFromRequest = (jwtStrategy as unknown as { _jwtFromRequest: JwtFromRequestCallback })._jwtFromRequest
    const extractedToken = jwtFromRequest(mockRequest)

    expect(extractedToken).toBeNull()
  })

  it('should return null when Authorization header has wrong format', () => {
    const mockRequest: MockRequest = {
      headers: {
        authorization: 'InvalidFormat jwt-token',
      },
    }

    const jwtFromRequest = (jwtStrategy as unknown as { _jwtFromRequest: JwtFromRequestCallback })._jwtFromRequest
    const extractedToken = jwtFromRequest(mockRequest)

    expect(extractedToken).toBeNull()
  })

  it('should return null when Authorization header is Bearer but no token', () => {
    const mockRequest: MockRequest = {
      headers: {
        authorization: 'Bearer ',
      },
    }

    const jwtFromRequest = (jwtStrategy as unknown as { _jwtFromRequest: JwtFromRequestCallback })._jwtFromRequest
    const extractedToken = jwtFromRequest(mockRequest)

    expect(extractedToken).toBeNull()
  })

  it('should verify strategy configuration', () => {
    expect(jwtStrategy).toBeDefined()
    expect(jwtStrategy.name).toBe('jwt')
    expect((jwtStrategy as unknown as { _jwtFromRequest: JwtFromRequestCallback })._jwtFromRequest).toBeDefined()
  })

  describe('Public User DTO creation', () => {
    it('should create correct PublicUserDTO structure', async () => {
      const payload: JwtPayload = { id: mockUser.id }
      const userWithComplexRole: UserDTO = {
        ...mockUser,
        role: {
          id: new Types.ObjectId().toString(),
          name: 'admin',
        },
        toPublicUser: jest.fn(),
      }

      mockUserService.findById.mockResolvedValue(userWithComplexRole)

      const verifyCallback = (jwtStrategy as unknown as { _verify: VerifyCallback })._verify
      await verifyCallback(payload, mockDone)

      expect(mockDone).toHaveBeenCalledWith(null, {
        id: userWithComplexRole.id,
        email: userWithComplexRole.email,
        name: userWithComplexRole.name,
        idDocument: userWithComplexRole.idDocument,
        role: userWithComplexRole.role.name,
      })
    })

    it('should handle user with minimal required fields', async () => {
      const payload: JwtPayload = { id: mockUser.id }
      const minimalUser: UserDTO = {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        idDocument: mockUser.idDocument,
        password: 'hashedPassword',
        role: { id: new Types.ObjectId().toString(), name: 'user' },
        toPublicUser: jest.fn(),
      } as UserDTO

      mockUserService.findById.mockResolvedValue(minimalUser)

      const verifyCallback = (jwtStrategy as unknown as { _verify: VerifyCallback })._verify
      await verifyCallback(payload, mockDone)

      expect(mockDone).toHaveBeenCalledWith(null, {
        id: minimalUser.id,
        email: minimalUser.email,
        name: minimalUser.name,
        idDocument: minimalUser.idDocument,
        role: minimalUser.role.name,
      })
    })

    it('should handle payload with missing user ID', async () => {
      const payload = {} as JwtPayload
      mockUserService.findById.mockResolvedValue(null)

      const verifyCallback = (jwtStrategy as unknown as { _verify: VerifyCallback })._verify
      await verifyCallback(payload, mockDone)

      expect(mockUserService.findById).toHaveBeenCalledWith(undefined)
      expect(mockDone).toHaveBeenCalledWith(null, false)
    })

    it('should handle payload with null user ID', async () => {
      const payload = { id: null as unknown as string }
      mockUserService.findById.mockResolvedValue(null)

      const verifyCallback = (jwtStrategy as unknown as { _verify: VerifyCallback })._verify
      await verifyCallback(payload, mockDone)

      expect(mockUserService.findById).toHaveBeenCalledWith(null)
      expect(mockDone).toHaveBeenCalledWith(null, false)
    })
  })
})
