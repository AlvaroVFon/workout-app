import { Schema, model } from 'mongoose'
import { CodeDTO } from '../DTOs/code/code.dto'

const codeSchema = new Schema<CodeDTO>(
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
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: false },
  },
)

const code = model<CodeDTO>('Code', codeSchema)

export default code
