import type { Express } from 'express'
import request from 'supertest'

describe('Rate Limit Middleware - Isolated Test', () => {
  let app: Express

  beforeAll(async () => {
    process.env.RATE_LIMIT_MAX = '3'
    process.env.RATE_LIMIT_WINDOW = '60000'

    jest.resetModules()

    const { getTestApp } = await import('../../utils/getApp')
    app = await getTestApp()
  })

  afterAll(() => {
    // Restaurar variables de entorno
    process.env.RATE_LIMIT_MAX = '10000'
    process.env.RATE_LIMIT_WINDOW = '60000'
    jest.resetModules()
  })

  it('should return TooManyRequestException if rate limit exceeded', async () => {
    // Hacer requests hasta el límite permitido (3)
    for (let i = 0; i < 3; i++) {
      const response = await request(app).get('/')
      expect(response.statusCode).toBe(200)
    }

    // El siguiente request debería superar el límite
    const response = await request(app).get('/')
    expect(response.statusCode).toBe(429)
    expect(response.body.error).toBe('Too Many Requests')
  })
})
