import Joi from 'joi'
import { CreateUserDTO } from '../../DTOs/user/create.dto'
import { UpdateUserDTO } from '../../DTOs/user/update.dto'
import { RolesEnum } from '../../utils/enums/roles.enum'

export const createUserSchema = Joi.object<CreateUserDTO>({
  name: Joi.string().required(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().required(),
  role: Joi.string()
    .valid(...Object.values(RolesEnum))
    .required(),
  password: Joi.string().min(6).required(),
  country: Joi.string().optional(),
  address: Joi.string().optional(),
  idDocument: Joi.string().required(),
}).required()

export const updateUserSchema = Joi.object<UpdateUserDTO>({
  name: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  role: Joi.string()
    .valid(...Object.values(RolesEnum))
    .optional(),
  country: Joi.string().optional(),
  address: Joi.string().optional(),
  idDocument: Joi.string().optional(),
}).required()
