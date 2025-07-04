import { BlockInfo } from '../DTOs/user/user.dto'
import userService from './user.service'

class BlockService {
  async isBlocked(userId: string, type: string): Promise<boolean> {
    const user = await userService.findById(userId)
    if (!user) return false

    return user.blocks.some((block) => block.blockedUntil > Date.now() && type === block.type)
  }

  async setBlock(userId: string, type: string, until: number, reason?: string) {
    const user = await userService.findById(userId)
    if (!user) return

    const blockInfo: BlockInfo = {
      type,
      reason,
      blockedUntil: until,
    }
    user.blocks.push(blockInfo)

    await userService.update(userId, { blocks: user?.blocks })
  }

  async getBlockInfo(userId: string, type: string) {
    const user = await userService.findById(userId)
    if (!user) return null

    return user.blocks.find((block) => block.type === type && block.blockedUntil > Date.now()) || null
  }

  async removeBlocks(userId: string, type: string) {
    const user = await userService.findById(userId)
    if (!user) return

    user.blocks = user.blocks.filter((block) => !(block.type === type && block.blockedUntil > Date.now()))
    await userService.update(userId, { blocks: user.blocks })
  }
}

export default new BlockService()
