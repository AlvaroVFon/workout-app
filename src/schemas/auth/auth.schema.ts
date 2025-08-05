import Joi from 'joi'
import { parameters } from '../../config/parameters'

const { codeLength } = parameters

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
}).required()

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
}).required()

export const resetPasswordSchema = Joi.object({
  code: Joi.string().length(codeLength).required(),
  password: Joi.string().min(6).max(128).required(),
}).required()

export const stringParamSchema = Joi.string().required()

export const refreshTokenSchema = Joi.string().required().label('x-refresh-token')

export const signupVerificationSchema = Joi.object({
  code: Joi.string().length(codeLength).required(),
}).required()
