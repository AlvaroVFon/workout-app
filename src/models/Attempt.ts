import { Schema, model } from 'mongoose'
import { AttemptDTO } from '../DTOs/attempt/attempt.dto'

const attemptSchema = new Schema<AttemptDTO>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    attemptedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    success: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'attemptedAt', updatedAt: false },
  },
)

const Attempt = model<AttemptDTO>('Attempt', attemptSchema)

export default Attempt
