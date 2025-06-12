import Joi from 'joi'
import Role from '../../DTOs/role/role.dto'
import { RolesEnum } from '../../utils/enums/roles.enum'

export const createRoleSchema = Joi.object<Role>({
  name: Joi.string()
    .valid(...Object.values(RolesEnum))
    .required(),
}).required()
