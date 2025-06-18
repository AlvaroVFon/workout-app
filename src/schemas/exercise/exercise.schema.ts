import Joi from 'joi'
import { MusclesEnum } from '../../utils/enums/muscles.enum'
import { DifficultyEnum } from '../../utils/enums/difficulty.enum'

const createExerciseSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  muscles: Joi.array()
    .items(Joi.string().valid(...Object.values(MusclesEnum)))
    .required(),
  difficulty: Joi.string()
    .valid(...Object.values(DifficultyEnum))
    .required(),
})

const updateExerciseSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  muscles: Joi.array()
    .items(Joi.string().valid(...Object.values(MusclesEnum)))
    .optional(),
  difficulty: Joi.string()
    .valid(...Object.values(DifficultyEnum))
    .optional(),
})

export { createExerciseSchema, updateExerciseSchema }
