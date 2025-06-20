import Joi from 'joi'

const objectIdSchema = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .message('Invalid ObjectId')

const paginationSchema = Joi.object({
  page: Joi.number().optional().default(1),
  limit: Joi.number().optional().default(20),
  paginate: Joi.boolean().optional().default(false),
})

export { objectIdSchema, paginationSchema }
