import RoleDTO from '../../../src/DTOs/role/role.dto'
import { UserDTO } from '../../../src/DTOs/user/user.dto'
import userService from '../../../src/services/user.service'
import { jwtStrategy } from '../../../src/strategies/jwt.strategy'
import { RolesEnum } from '../../../src/utils/enums/roles.enum'

jest.mock('../../../src/services/user.service')

describe('JWT Strategy', () => {
  const mockUserService = userService as jest.Mocked<typeof userService>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockRole: RoleDTO = {
    id: '1',
    name: RolesEnum.USER,
  }

  const mockUser = new UserDTO({
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    idDocument: '12345678',
    role: mockRole,
    password: 'hashedPassword',
  } as UserDTO)

  describe('validate', () => {
    it('should return user when valid access token payload is provided', (done) => {
      const payload = { id: '1', type: 'access' }
      mockUserService.findById.mockResolvedValue(mockUser)

      const callback = (err: any, user: any) => {
        try {
          expect(err).toBeNull()
          expect(mockUserService.findById).toHaveBeenCalledWith('1')
          expect(user).toEqual({
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            idDocument: '12345678',
            role: 'user',
          })
          done()
        } catch (error) {
          done(error)
        }
      }

      // Access the verify function through the strategy instance
      ;(jwtStrategy as any)._verify(payload, callback)
    })

    it('should return false when user is not found', (done) => {
      const payload = { id: '999', type: 'access' }
      mockUserService.findById.mockResolvedValue(null)

      const callback = (err: any, user: any) => {
        try {
          expect(err).toBeNull()
          expect(mockUserService.findById).toHaveBeenCalledWith('999')
          expect(user).toBe(false)
          done()
        } catch (error) {
          done(error)
        }
      }

      ;(jwtStrategy as any)._verify(payload, callback)
    })

    it('should return false when token type is not access', (done) => {
      const payload = { id: '1', type: 'refresh' }
      mockUserService.findById.mockResolvedValue(mockUser)

      const callback = (err: any, user: any) => {
        try {
          expect(err).toBeNull()
          expect(mockUserService.findById).toHaveBeenCalledWith('1')
          expect(user).toBe(false)
          done()
        } catch (error) {
          done(error)
        }
      }

      ;(jwtStrategy as any)._verify(payload, callback)
    })

    it('should return false when token type is missing', (done) => {
      const payload = { id: '1' }
      mockUserService.findById.mockResolvedValue(mockUser)

      const callback = (err: any, user: any) => {
        try {
          expect(err).toBeNull()
          expect(mockUserService.findById).toHaveBeenCalledWith('1')
          expect(user).toBe(false)
          done()
        } catch (error) {
          done(error)
        }
      }

      ;(jwtStrategy as any)._verify(payload, callback)
    })

    it('should handle errors gracefully', (done) => {
      const payload = { id: '1', type: 'access' }
      const error = new Error('Database error')
      mockUserService.findById.mockRejectedValue(error)

      const callback = (err: any, user: any) => {
        try {
          expect(err).toBe(error)
          expect(mockUserService.findById).toHaveBeenCalledWith('1')
          expect(user).toBe(false)
          done()
        } catch (testError) {
          done(testError)
        }
      }

      ;(jwtStrategy as any)._verify(payload, callback)
    })
  })
})
