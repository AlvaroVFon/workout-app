import Joi from 'joi'
import { DisciplineCategoryEnum } from '../../utils/enums/discipline-category.enum'
import { DisciplineEnum } from '../../utils/enums/discipline.enum'

export const createDisciplineSchema = Joi.object({
  name: Joi.string()
    .valid(...Object.values(DisciplineEnum))
    .required(),
  category: Joi.array()
    .items(Joi.string().valid(...Object.values(DisciplineCategoryEnum)))
    .required(),
}).required()

export const updateDisciplineSchema = Joi.object({
  name: Joi.string()
    .valid(...Object.values(DisciplineEnum))
    .optional(),
  category: Joi.array()
    .items(Joi.string().valid(...Object.values(DisciplineCategoryEnum)))
    .optional(),
}).required()
