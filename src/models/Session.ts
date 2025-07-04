import { Schema, Types, model } from 'mongoose'
import { SessionDTO } from '../DTOs/session/session.dto'

const sessionSchema = new Schema<SessionDTO>(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Number,
      required: true,
    },
    refreshTokenHash: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    replacedBy: {
      type: Types.ObjectId,
      ref: 'Session',
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
)

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const Session = model<SessionDTO>('Session', sessionSchema)

export default Session
