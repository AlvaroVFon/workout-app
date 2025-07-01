import { Express } from 'express'
import request from 'supertest'
import { getTestApp } from '../utils/getApp'

describe('Healthcheck', () => {
  let app: Express

  beforeAll(async () => {
    app = await getTestApp()
  })

  it('Should return a 200 status and a JSON response', async () => {
    const response = await request(app).get('/health')

    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        status: expect.anything(),
        date: expect.anything(),
        service: expect.anything(),
        version: expect.anything(),
      }),
    )
  })
})
