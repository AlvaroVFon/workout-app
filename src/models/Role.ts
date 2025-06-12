import { Schema, model } from 'mongoose'
import RoleDTO from '../DTOs/role/role.dto'
import { RolesEnum } from '../utils/enums/roles.enum'

const roleSchema = new Schema({
  name: {
    type: String,
    unique: true,
    enum: Object.values(RolesEnum),
  },
})

const Role = model<RoleDTO>('Role', roleSchema)
export default Role
