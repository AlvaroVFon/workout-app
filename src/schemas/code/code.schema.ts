import Joi from 'joi'
import { CodeType } from '../../utils/enums/code.enum'

const codeSchema = Joi.object({
  userId: Joi.string().required(),
  code: Joi.string().length(6).required(),
  used: Joi.boolean().default(false),
  expiresAt: Joi.number().required(),
  type: Joi.string()
    .required()
    .valid(...Object.values(CodeType)),
})

export { codeSchema }
