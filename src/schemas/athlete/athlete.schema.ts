import Joi from 'joi'
import { GenderEnum } from '../../utils/enums/gender.enum'
import { DisciplineEnum } from '../../utils/enums/discipline.enum'
import { objectIdSchema } from '../utils.schema'

const createAthleteSchema = Joi.object({
  email: Joi.string().min(5).max(128).required(),
  firstname: Joi.string().min(3).max(40).required(),
  lastname: Joi.string().min(3).max(40).required(),
  gender: Joi.string()
    .valid(...Object.values(GenderEnum))
    .optional(),
  height: Joi.number().min(1).max(999).optional(),
  weight: Joi.number().min(1).max(999).optional(),
  disciplines: Joi.array()
    .items(Joi.string().valid(...Object.values(DisciplineEnum)))
    .optional(),
  goals: Joi.array().items(Joi.string().min(3).max(100)).optional(),
  notes: Joi.string().optional(),
  idDocument: Joi.string().min(1).max(21).required(),
  phone: Joi.string()
    .pattern(/^\+?(6\d{2}|7[1-9]\d{1})\d{6}$/)
    .optional(),
}).required()

const updateAthleteSchema = Joi.object({
  email: Joi.string().min(5).max(128).optional(),
  firstname: Joi.string().min(3).max(40).optional(),
  lastname: Joi.string().min(3).max(40).optional(),
  gender: Joi.string()
    .valid(...Object.values(GenderEnum))
    .optional(),
  height: Joi.number().min(1).max(999).optional(),
  weight: Joi.number().min(1).max(999).optional(),
  goals: Joi.array().items(Joi.string().min(3).max(100)).optional(),
  disciplines: Joi.array()
    .items(Joi.string().valid(...Object.values(DisciplineEnum)))
    .optional(),
  notes: Joi.string().optional(),
  idDocument: Joi.string().min(1).max(21).optional(),
  phone: Joi.string()
    .pattern(/^\+?(6\d{2}|7[1-9]\d{1})\d{6}$/)
    .optional(),
}).required()

const updateAthleteDisciplineSchema = Joi.object({
  disciplines: Joi.array().items(objectIdSchema).required(),
}).required()

export { createAthleteSchema, updateAthleteSchema, updateAthleteDisciplineSchema }
