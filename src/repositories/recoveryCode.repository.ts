import RecoveryCode from '../models/RecoveryCode'
import { CreateRecoveryCodeDTO } from '../DTOs/recoveryCode/create.dto'
import { ModelQuery } from '../types/index.types'
import { RecoveryCodeDTO } from '../DTOs/recoveryCode/recoveryCode.dto'

class RecoveryCodeRepository {
  create(code: CreateRecoveryCodeDTO) {
    return RecoveryCode.create(code)
  }

  findOne({ query = {}, projection = {}, options = {} }: ModelQuery<RecoveryCodeDTO> = {}) {
    return RecoveryCode.findOne(query, projection, options).exec()
  }

  findByUserId(userId: string): Promise<RecoveryCodeDTO[]> {
    return RecoveryCode.find({ userId }).exec()
  }
}

export default new RecoveryCodeRepository()
