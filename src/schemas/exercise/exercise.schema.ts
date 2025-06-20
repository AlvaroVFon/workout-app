import Joi from 'joi'
import { MusclesEnum } from '../../utils/enums/muscles.enum'
import { DifficultyEnum } from '../../utils/enums/difficulty.enum'

const createExerciseSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  description: Joi.string().min(10).max(500).required(),
  muscles: Joi.array()
    .items(Joi.string().valid(...Object.values(MusclesEnum)))
    .required(),
  difficulty: Joi.string()
    .valid(...Object.values(DifficultyEnum))
    .required(),
})

const updateExerciseSchema = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  description: Joi.string().min(10).max(500).optional(),
  muscles: Joi.array()
    .items(Joi.string().valid(...Object.values(MusclesEnum)))
    .optional(),
  difficulty: Joi.string()
    .valid(...Object.values(DifficultyEnum))
    .optional(),
})

export { createExerciseSchema, updateExerciseSchema }
