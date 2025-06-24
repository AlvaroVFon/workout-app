import Joi from 'joi'
import { TrainingTypeEnum } from '../../utils/enums/trainingTypes.enum'

const trainingTypeValues = Object.values(TrainingTypeEnum)

export const setSchema = Joi.object({
  reps: Joi.number().integer().min(1).required(),
  weight: Joi.number().min(0).optional(),
  rir: Joi.number().integer().min(0).max(5).optional(),
})

export const exerciseEntrySchema = Joi.object({
  exercise: Joi.string().hex().length(24).required(),
  sets: Joi.array().items(setSchema).min(1).required(),
})

export const createTrainingSessionSchema = Joi.object({
  athlete: Joi.string().hex().length(24).required(),
  date: Joi.date()
    .optional()
    .default(() => new Date()),
  type: Joi.string()
    .valid(...trainingTypeValues)
    .optional()
    .default(TrainingTypeEnum.STRENGTH),
  exercises: Joi.array().items(exerciseEntrySchema).min(1).required(),
  perceivedEffort: Joi.number().integer().min(1).max(10).optional(),
  notes: Joi.string().max(500).optional(),
  sessionDuration: Joi.number().min(1).max(600).optional(),
  tags: Joi.array().items(Joi.string().max(30)).optional(),
})

export const updateTrainingSessionSchema = Joi.object({
  date: Joi.date().optional(),
  type: Joi.string()
    .valid(...trainingTypeValues)
    .optional(),
  exercises: Joi.array().items(exerciseEntrySchema).min(1).optional(),
  perceivedEffort: Joi.number().integer().min(1).max(10).optional(),
  notes: Joi.string().max(500).optional(),
  sessionDuration: Joi.number().min(1).max(600).optional(),
  tags: Joi.array().items(Joi.string().max(30)).optional(),
}).min(1)
