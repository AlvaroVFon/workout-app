import { BlockInfo } from '../../../src/DTOs/user/user.dto'
import blockService from '../../../src/services/block.service'
import userService from '../../../src/services/user.service'

jest.mock('../../../src/services/user.service')

describe('BlockService', () => {
  const userId = 'user123'
  const type = 'login'
  const now = Date.now()
  const future = now + 10000
  const past = now - 10000

  const block: BlockInfo = {
    type,
    reason: 'test',
    blockedUntil: future,
  }

  const user = {
    _id: userId,
    blocks: [block],
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('isBlocked', () => {
    it('returns false if user not found', async () => {
      ;(userService.findById as jest.Mock).mockResolvedValue(null)
      const result = await blockService.isBlocked(userId, type)
      expect(result).toBe(false)
    })
    it('returns true if user is blocked for type', async () => {
      ;(userService.findById as jest.Mock).mockResolvedValue(user)
      const result = await blockService.isBlocked(userId, type)
      expect(result).toBe(true)
    })
    it('returns false if block expired', async () => {
      ;(userService.findById as jest.Mock).mockResolvedValue({ ...user, blocks: [{ ...block, blockedUntil: past }] })
      const result = await blockService.isBlocked(userId, type)
      expect(result).toBe(false)
    })
    it('returns false if block type does not match', async () => {
      ;(userService.findById as jest.Mock).mockResolvedValue({ ...user, blocks: [{ ...block, type: 'other' }] })
      const result = await blockService.isBlocked(userId, type)
      expect(result).toBe(false)
    })
  })

  describe('setBlock', () => {
    it('does nothing if user not found', async () => {
      ;(userService.findById as jest.Mock).mockResolvedValue(null)
      await blockService.setBlock(userId, type, future, 'reason')
      expect(userService.update).not.toHaveBeenCalled()
    })
    it('adds a block and updates user', async () => {
      const userWithNoBlocks = { ...user, blocks: [] } as any
      ;(userService.findById as jest.Mock).mockResolvedValue(userWithNoBlocks)
      await blockService.setBlock(userId, type, future, 'reason')
      expect(userService.update).toHaveBeenCalledWith(userId, {
        blocks: [expect.objectContaining({ type, reason: 'reason', blockedUntil: future })],
      })
    })
  })

  describe('getBlockInfo', () => {
    it('returns null if user not found', async () => {
      ;(userService.findById as jest.Mock).mockResolvedValue(null)
      const result = await blockService.getBlockInfo(userId, type)
      expect(result).toBeNull()
    })
    it('returns block info if block is active', async () => {
      ;(userService.findById as jest.Mock).mockResolvedValue(user)
      const result = await blockService.getBlockInfo(userId, type)
      expect(result).toEqual(block)
    })
    it('returns null if no active block of type', async () => {
      ;(userService.findById as jest.Mock).mockResolvedValue({ ...user, blocks: [{ ...block, blockedUntil: past }] })
      const result = await blockService.getBlockInfo(userId, type)
      expect(result).toBeNull()
    })
  })

  describe('removeBlocks', () => {
    it('does nothing if user not found', async () => {
      ;(userService.findById as jest.Mock).mockResolvedValue(null)
      await blockService.removeBlocks(userId, type)
      expect(userService.update).not.toHaveBeenCalled()
    })
    it('removes only active blocks of type and updates user', async () => {
      const blocks = [
        { ...block, blockedUntil: future },
        { ...block, blockedUntil: past },
        { ...block, type: 'other', blockedUntil: future },
      ]
      const userWithBlocks = { ...user, blocks } as any
      ;(userService.findById as jest.Mock).mockResolvedValue(userWithBlocks)
      await blockService.removeBlocks(userId, type)
      expect(userService.update).toHaveBeenCalledWith(userId, { blocks: [blocks[1], blocks[2]] })
    })
  })
})
