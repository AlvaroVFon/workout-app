import { Schema, model } from 'mongoose'
import { RecoveryCodeDTO } from '../DTOs/recoveryCode/recoveryCode.dto'

const recoveryCodeSchema = new Schema<RecoveryCodeDTO>(
  {
    userId: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: false },
  },
)

const RecoveryCode = model<RecoveryCodeDTO>('RecoveryCode', recoveryCodeSchema)

export default RecoveryCode
