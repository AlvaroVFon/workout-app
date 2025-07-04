import Joi from 'joi'
process.loadEnvFile()

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  MONGO_URI: Joi.string().required(),
  REDIS_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('1h'),
  JWT_REFRESH_EXPIRATION: Joi.string().default('30d'),
  SALT_ROUNDS: Joi.number().default(10),
  SMTP_HOST: Joi.string().default('localhost'),
  SMTP_PORT: Joi.number().default(587),
  SMTP_SECURE: Joi.boolean().default(false),
  SMTP_USER: Joi.string().optional().default(''),
  SMTP_PASS: Joi.string().optional().default(''),
  SMTP_FROM: Joi.string().optional().default('admin@email.com'),
  SMTP_FROM_NAME: Joi.string().optional().default('Admin'),
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly').default('info'),
})
  .unknown()
  .required()

const { error, value: envVars } = envVarsSchema.validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

export const parameters = {
  nodeEnv: envVars.NODE_ENV,
  port: envVars.PORT,
  databaseUrl: envVars.MONGO_URI,
  cacheUrl: envVars.REDIS_URI,
  jwtSecret: envVars.JWT_SECRET,
  jwtExpiration: envVars.JWT_EXPIRATION,
  jwtRefreshExpiration: envVars.JWT_REFRESH_EXPIRATION,
  saltRounds: envVars.SALT_ROUNDS,
  smtpHost: envVars.SMTP_HOST,
  smtpPort: envVars.SMTP_PORT,
  smtpSecure: envVars.SMTP_SECURE,
  smtpUser: envVars.SMTP_USER,
  smtpPass: envVars.SMTP_PASS,
  smtpFrom: envVars.SMTP_FROM,
  smtpFromName: envVars.SMTP_FROM_NAME,
  logLevel: envVars.LOG_LEVEL,
}
