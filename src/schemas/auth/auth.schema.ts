import Joi from 'joi'

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
}).required()

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
}).required()

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
}).required()

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().required(),
  password: Joi.string().min(6).max(128).required(),
}).required()

export const headerTokenSchema = Joi.string().required().label('x-refresh-token')
