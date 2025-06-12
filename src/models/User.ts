import { Schema, Types, model } from 'mongoose'
import { UserDTO } from '../DTOs/user/user.dto'

const userSchema = new Schema({
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
    ref: 'Roles',
    required: true,
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
