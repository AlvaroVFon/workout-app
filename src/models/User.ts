import { Schema, Types, model } from 'mongoose'
import { UserDTO } from '../DTOs/user/user.dto'
import type { BlockInfo } from '../DTOs/user/user.dto'

const BlockInfoSchema = new Schema<BlockInfo>(
  {
    type: { type: String, required: true },
    reason: { type: String },
    blockedUntil: { type: Number },
  },
  { _id: false },
)

const userSchema = new Schema<UserDTO>({
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Types.ObjectId,
    ref: 'Role',
    required: true,
  },
  blocks: {
    type: [BlockInfoSchema],
    default: [],
  },
  country: {
    type: String,
  },
  address: {
    type: String,
  },
  idDocument: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
  updatedAt: {
    type: Number,
    default: null,
  },
})

const User = model<UserDTO>('User', userSchema)

export default User
