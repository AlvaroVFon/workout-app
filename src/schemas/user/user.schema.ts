import Joi from 'joi'
import { CreateUserDTO } from '../../DTOs/user/create.dto'
import { UpdateUserDTO } from '../../DTOs/user/update.dto'
import { RolesEnum } from '../../utils/enums/roles.enum'

export const createUserSchema = Joi.object<CreateUserDTO>({
  name: Joi.string().min(3).max(50).required(),
  lastName: Joi.string().min(3).max(50).optional(),
  email: Joi.string().email().required(),
  role: Joi.string()
    .valid(...Object.values(RolesEnum))
    .required(),
  password: Joi.string().min(6).max(128).required(),
  country: Joi.string().min(2).max(50).optional(),
  address: Joi.string().min(5).max(100).optional(),
  idDocument: Joi.string().min(5).max(20).required(),
}).required()

export const updateUserSchema = Joi.object<UpdateUserDTO>({
  name: Joi.string().min(3).max(50).optional(),
  lastName: Joi.string().min(3).max(50).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).max(128).optional(),
  role: Joi.string()
    .valid(...Object.values(RolesEnum))
    .optional(),
  country: Joi.string().min(2).max(50).optional(),
  address: Joi.string().min(5).max(100).optional(),
  idDocument: Joi.string().min(5).max(20).optional(),
}).required()
