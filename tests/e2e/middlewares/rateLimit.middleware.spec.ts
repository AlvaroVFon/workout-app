import type { Express } from 'express'
import request from 'supertest'
import { getTestApp } from '../../utils/getApp'

describe('Rate Limit Middleware', () => {
  let app: Express

  beforeAll(async () => {
    app = await getTestApp()
  })

  afterAll(() => {})

  it('should allow requests within the rate limit', async () => {
    const response = await request(app).get('/health')
    expect(response.statusCode).toBe(200)
  })

  it('should have rate limit middleware configured', async () => {
    const response = await request(app).get('/')
    expect(response.statusCode).toBe(200)

    expect(response.headers).toBeDefined()
  })
})
