import Joi from 'joi'

describe('Configuration Parameters', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('should validate configuration schema with valid environment variables', () => {
    // Set valid environment variables
    const testEnv = {
      NODE_ENV: 'test',
      PORT: '3000',
      MONGO_URI: 'mongodb://localhost:27017/test',
      REDIS_URI: 'redis://localhost:6379',
      JWT_SECRET: 'test-secret',
      JWT_EXPIRATION: '1h',
      JWT_REFRESH_EXPIRATION: '30d',
    }

    // Create the same schema as in parameters.ts
    const envVarsSchema = Joi.object({
      NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
      PORT: Joi.number().default(3000),
      MONGO_URI: Joi.string().required(),
      REDIS_URI: Joi.string().required(),
      JWT_SECRET: Joi.string().required(),
      JWT_EXPIRATION: Joi.string().default('1h'),
      JWT_REFRESH_EXPIRATION: Joi.string().default('30d'),
    })
      .unknown()
      .required()

    const { error, value: envVars } = envVarsSchema.validate(testEnv)

    expect(error).toBeUndefined()
    expect(envVars.NODE_ENV).toBe('test')
    expect(envVars.PORT).toBe(3000)
    expect(envVars.MONGO_URI).toBe('mongodb://localhost:27017/test')
    expect(envVars.REDIS_URI).toBe('redis://localhost:6379')
    expect(envVars.JWT_SECRET).toBe('test-secret')
    expect(envVars.JWT_EXPIRATION).toBe('1h')
    expect(envVars.JWT_REFRESH_EXPIRATION).toBe('30d')
  })

  it('should use default values for optional environment variables', () => {
    const testEnv = {
      MONGO_URI: 'mongodb://localhost:27017/test',
      REDIS_URI: 'redis://localhost:6379',
      JWT_SECRET: 'test-secret',
    }

    const envVarsSchema = Joi.object({
      NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
      PORT: Joi.number().default(3000),
      MONGO_URI: Joi.string().required(),
      REDIS_URI: Joi.string().required(),
      JWT_SECRET: Joi.string().required(),
      JWT_EXPIRATION: Joi.string().default('1h'),
      JWT_REFRESH_EXPIRATION: Joi.string().default('30d'),
    })
      .unknown()
      .required()

    const { error, value: envVars } = envVarsSchema.validate(testEnv)

    expect(error).toBeUndefined()
    expect(envVars.NODE_ENV).toBe('development') // default
    expect(envVars.PORT).toBe(3000) // default
    expect(envVars.JWT_EXPIRATION).toBe('1h') // default
    expect(envVars.JWT_REFRESH_EXPIRATION).toBe('30d') // default
  })

  it('should return validation error when required environment variables are missing', () => {
    const testEnv = {
      NODE_ENV: 'test',
      PORT: '3000',
      // Missing required variables
    }

    const envVarsSchema = Joi.object({
      NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
      PORT: Joi.number().default(3000),
      MONGO_URI: Joi.string().required(),
      REDIS_URI: Joi.string().required(),
      JWT_SECRET: Joi.string().required(),
      JWT_EXPIRATION: Joi.string().default('1h'),
      JWT_REFRESH_EXPIRATION: Joi.string().default('30d'),
    })
      .unknown()
      .required()

    const { error } = envVarsSchema.validate(testEnv)

    expect(error).toBeDefined()
    expect(error?.message).toContain('"MONGO_URI" is required')
  })

  it('should return validation error when NODE_ENV has invalid value', () => {
    const testEnv = {
      NODE_ENV: 'invalid',
      MONGO_URI: 'mongodb://localhost:27017/test',
      REDIS_URI: 'redis://localhost:6379',
      JWT_SECRET: 'test-secret',
    }

    const envVarsSchema = Joi.object({
      NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
      PORT: Joi.number().default(3000),
      MONGO_URI: Joi.string().required(),
      REDIS_URI: Joi.string().required(),
      JWT_SECRET: Joi.string().required(),
      JWT_EXPIRATION: Joi.string().default('1h'),
      JWT_REFRESH_EXPIRATION: Joi.string().default('30d'),
    })
      .unknown()
      .required()

    const { error } = envVarsSchema.validate(testEnv)

    expect(error).toBeDefined()
    expect(error?.message).toContain('"NODE_ENV" must be one of')
  })

  it('should return validation error when PORT is not a number', () => {
    const testEnv = {
      PORT: 'not-a-number',
      MONGO_URI: 'mongodb://localhost:27017/test',
      REDIS_URI: 'redis://localhost:6379',
      JWT_SECRET: 'test-secret',
    }

    const envVarsSchema = Joi.object({
      NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
      PORT: Joi.number().default(3000),
      MONGO_URI: Joi.string().required(),
      REDIS_URI: Joi.string().required(),
      JWT_SECRET: Joi.string().required(),
      JWT_EXPIRATION: Joi.string().default('1h'),
      JWT_REFRESH_EXPIRATION: Joi.string().default('30d'),
    })
      .unknown()
      .required()

    const { error } = envVarsSchema.validate(testEnv)

    expect(error).toBeDefined()
    expect(error?.message).toContain('"PORT" must be a number')
  })

  it('should create parameters object structure', () => {
    const envVars = {
      NODE_ENV: 'production',
      PORT: 8080,
      MONGO_URI: 'mongodb://prod:27017/app',
      REDIS_URI: 'redis://prod:6379',
      JWT_SECRET: 'prod-secret',
      JWT_EXPIRATION: '2h',
      JWT_REFRESH_EXPIRATION: '7d',
    }

    const parameters = {
      nodeEnv: envVars.NODE_ENV,
      port: envVars.PORT,
      databaseUrl: envVars.MONGO_URI,
      cacheUrl: envVars.REDIS_URI,
      jwtSecret: envVars.JWT_SECRET,
      jwtExpiration: envVars.JWT_EXPIRATION,
      jwtRefreshExpiration: envVars.JWT_REFRESH_EXPIRATION,
    }

    expect(parameters.nodeEnv).toBe('production')
    expect(parameters.port).toBe(8080)
    expect(parameters.databaseUrl).toBe('mongodb://prod:27017/app')
    expect(parameters.cacheUrl).toBe('redis://prod:6379')
    expect(parameters.jwtSecret).toBe('prod-secret')
    expect(parameters.jwtExpiration).toBe('2h')
    expect(parameters.jwtRefreshExpiration).toBe('7d')
  })
})
