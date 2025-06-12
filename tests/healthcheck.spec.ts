import request from 'supertest'
import { Express } from 'express'
import { getTestApp } from './utils/getApp'

describe('Healthcheck', () => {
  let app: Express

  beforeAll(async () => {
    app = await getTestApp()
  })

  it('Should return a 200 status and a JSON response', async () => {
    const response = await request(app).get('/health')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ status: 'ok', date: expect.any(String) })
  })
})
