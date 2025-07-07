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
  MAX_LOGIN_ATTEMPTS: Joi.number().default(5),
  MAX_PASSWORD_RESET_ATTEMPTS: Joi.number().default(3),
  BLOCK_DURATION: Joi.number().default(900000),
  CODE_EXPIRATION: Joi.number().default(300000),
  CODE_LENGTH: Joi.number().default(6),
  CODE_RETRY_INTERVAL: Joi.number().default(30000),
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
  maxLoginAttempts: envVars.MAX_LOGIN_ATTEMPTS,
  maxPasswordResetAttempts: envVars.MAX_PASSWORD_RESET_ATTEMPTS,
  blockDuration: envVars.BLOCK_DURATION,
  codeExpiration: envVars.CODE_EXPIRATION,
  codeLength: envVars.CODE_LENGTH,
  codeRetryInterval: envVars.CODE_RETRY_INTERVAL,
}
