import Joi from 'joi'
import { MusclesEnum } from '../../utils/enums/muscles.enum'

const createMuscleSchema = Joi.object({
  name: Joi.string()
    .valid(...Object.values(MusclesEnum))
    .required(),
})

export { createMuscleSchema }
