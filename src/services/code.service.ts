import { generateCode } from '../utils/codeGenerator.utils'
import codeRepository from '../repositories/code.repository'
import { CodeDTO } from '../DTOs/code/code.dto'
import { CodeType } from '../utils/enums/code.enum'
import { parameters } from '../config/parameters'

const { codeExpiration } = parameters

class CodeService {
  async create(userId: string, type: CodeType): Promise<CodeDTO> {
    const code = generateCode(6)
    return codeRepository.create({
      userId,
      code,
      expiresAt: Date.now() + codeExpiration,
      type,
    })
  }

  async findLastByUserIdAndType(userId: string, type: CodeType) {
    return codeRepository.findOne({
      query: { userId, type, used: false },
      options: { sort: { createdAt: -1 } },
    })
  }

  async isCodeValid(code: string, userId: string): Promise<boolean> {
    const codeData = await codeRepository.findOne({
      query: { code, userId, used: false },
      projection: { expiresAt: 1 },
    })

    if (!codeData) return false

    return Date.now() < codeData.expiresAt
  }

  async invalidateCode(code: string, userId: string): Promise<CodeDTO | null> {
    return codeRepository.update({ userId, code }, { used: true })
  }
}

export default new CodeService()
