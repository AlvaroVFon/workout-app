import Joi from 'joi'
process.loadEnvFile()

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  APP_NAME: Joi.string().default('workout-app'),
  PORT: Joi.number().default(3000),
  MONGO_URI: Joi.string().required(),
  REDIS_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('1h'),
  JWT_REFRESH_EXPIRATION: Joi.string().default('30d'),
  JWT_RESET_PASSWORD_EXPIRATION: Joi.string().default('1h'),
  JWT_SIGNUP_EXPIRATION: Joi.string().default('1h'),
  CACHE_TTL: Joi.number().optional().default(3600),
  SALT_ROUNDS: Joi.number().default(10),
  SMTP_HOST: Joi.string().default('localhost'),
  SMTP_PORT: Joi.number().default(587),
  SMTP_SECURE: Joi.boolean().default(false),
  SMTP_USER: Joi.string().optional().default(''),
  SMTP_PASS: Joi.string().optional().default(''),
  SMTP_FROM: Joi.string().optional().default('admin@email.com'),
  SMTP_FROM_NAME: Joi.string().optional().default('Admin'),
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly').default('info'),
  MAX_SIGNUP_ATTEMPTS: Joi.number().default(5),
  MAX_LOGIN_ATTEMPTS: Joi.number().default(5),
  MAX_PASSWORD_RESET_ATTEMPTS: Joi.number().default(3),
  BLOCK_DURATION: Joi.number().default(900000),
  CODE_EXPIRATION: Joi.number().default(300000),
  CODE_LENGTH: Joi.number().default(6),
  CODE_RETRY_INTERVAL: Joi.number().default(30000),
  FRONTEND_URL: Joi.string().uri().default('http://localhost:5173'),
  QUEUE_MAX_ATTEMPTS: Joi.number().default(5),
  QUEUE_BACKOFF: Joi.number().default(3000),
  QUEUE_REDIS_URL: Joi.string().uri().default('redis://localhost:6379'),
  PAGINATION_MAX_LIMIT: Joi.number().default(20),
  RATE_LIMIT_WINDOW: Joi.string().default(900000),
  RATE_LIMIT_MAX: Joi.number().default(1000),
})
  .unknown()
  .required()

const { error, value: envVars } = envVarsSchema.validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

export const parameters = {
  nodeEnv: envVars.NODE_ENV,
  appName: envVars.APP_NAME,
  port: envVars.PORT,
  databaseUrl: envVars.MONGO_URI,
  cacheUrl: envVars.REDIS_URI,
  jwtSecret: envVars.JWT_SECRET,
  jwtExpiration: envVars.JWT_EXPIRATION,
  jwtRefreshExpiration: envVars.JWT_REFRESH_EXPIRATION,
  jwtResetPasswordExpiration: envVars.JWT_RESET_PASSWORD_EXPIRATION,
  jwtSignupExpiration: envVars.JWT_SIGNUP_EXPIRATION,
  saltRounds: envVars.SALT_ROUNDS,
  smtpHost: envVars.SMTP_HOST,
  smtpPort: envVars.SMTP_PORT,
  smtpSecure: envVars.SMTP_SECURE,
  smtpUser: envVars.SMTP_USER,
  smtpPass: envVars.SMTP_PASS,
  smtpFrom: envVars.SMTP_FROM,
  smtpFromName: envVars.SMTP_FROM_NAME,
  logLevel: envVars.LOG_LEVEL,
  maxSignupAttempts: envVars.MAX_SIGNUP_ATTEMPTS,
  maxLoginAttempts: envVars.MAX_LOGIN_ATTEMPTS,
  maxPasswordResetAttempts: envVars.MAX_PASSWORD_RESET_ATTEMPTS,
  blockDuration: envVars.BLOCK_DURATION,
  codeExpiration: envVars.CODE_EXPIRATION,
  codeLength: envVars.CODE_LENGTH,
  codeRetryInterval: envVars.CODE_RETRY_INTERVAL,
  frontUrl: envVars.FRONTEND_URL,
  cacheTtl: envVars.CACHE_TTL,
  queueMaxAttempts: envVars.QUEUE_MAX_ATTEMPTS,
  queueBackoff: envVars.QUEUE_BACKOFF,
  queueRedisUrl: envVars.QUEUE_REDIS_URL,
  paginationMaxLimit: envVars.PAGINATION_MAX_LIMIT,
  rateLimitWindow: envVars.RATE_LIMIT_WINDOW,
  rateLimitMax: envVars.RATE_LIMIT_MAX,
}
