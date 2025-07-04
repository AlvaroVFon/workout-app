import { Express } from 'express'
import jwt from 'jsonwebtoken'
import request from 'supertest'
import { parameters } from '../../src/config/parameters'
import roleRepository from '../../src/repositories/role.repository'
import { getTestApp } from '../utils/getApp'

describe('Auth E2E', () => {
  let app: Express
  let validUser: any
  let accessToken: string
  let refreshToken: string

  beforeAll(async () => {
    app = await getTestApp()

    try {
      const existingRole = await roleRepository.findOne({ name: 'user' })
      if (!existingRole) {
        await roleRepository.create('user')
      }
    } catch (error) {
      try {
        await roleRepository.create('user')
      } catch (createError) {
        console.warn('Could not create user role:', createError)
      }
    }

    // Create a test user first
    const signUpResponse = await request(app).post('/auth/signup').send({
      name: 'Test',
      lastName: 'User',
      email: 'test.refresh@example.com',
      password: 'password123',
      role: 'user',
      idDocument: '12345678901',
      country: 'Test Country',
      address: 'Test Address',
    })

    if (signUpResponse.status !== 201) {
      throw new Error(`Signup failed: ${JSON.stringify(signUpResponse.body)}`)
    }

    validUser = signUpResponse.body.data

    // Login to get tokens
    const loginResponse = await request(app).post('/auth/login').send({
      email: 'test.refresh@example.com',
      password: 'password123',
    })

    if (loginResponse.status !== 200) {
      throw new Error(`Login failed: ${JSON.stringify(loginResponse.body)}`)
    }

    accessToken = loginResponse.body.data.token
    refreshToken = loginResponse.body.data.refreshToken
  })

  describe('POST /auth/refresh', () => {
    it('should refresh tokens successfully with valid refresh token', async () => {
      // Add small delay to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 1100))

      const response = await request(app).post('/auth/refresh').send({
        refreshToken: refreshToken,
      })

      expect(response.status).toBe(200)
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 200,
          message: 'Success',
          data: expect.objectContaining({
            token: expect.any(String),
            refreshToken: expect.any(String),
          }),
        }),
      )

      // Verify new tokens are valid and have correct structure
      const newAccessPayload = jwt.decode(response.body.data.token) as any
      const newRefreshPayload = jwt.decode(response.body.data.refreshToken) as any

      expect(newAccessPayload.type).toBe('access')
      expect(newRefreshPayload.type).toBe('refresh')
      expect(newAccessPayload.email).toBe('test.refresh@example.com')

      // With the delay, tokens should have different iat timestamps
      const originalAccessPayload = jwt.decode(accessToken) as any
      expect(newAccessPayload.iat).toBeGreaterThan(originalAccessPayload.iat)
    })

    it('should return 401 when using an invalid refresh token', async () => {
      const response = await request(app).post('/auth/refresh').send({
        refreshToken: 'invalid.refresh.token',
      })

      expect(response.status).toBe(401)
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 401,
          error: 'Invalid refresh token',
        }),
      )
    })

    it('should return 401 when using an access token as refresh token', async () => {
      const response = await request(app).post('/auth/refresh').send({
        refreshToken: accessToken, // Using access token instead of refresh token
      })

      expect(response.status).toBe(401)
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 401,
          error: 'Invalid refresh token',
        }),
      )
    })

    it('should return 400 when refresh token is missing from request body', async () => {
      const response = await request(app).post('/auth/refresh').send({})

      expect(response.status).toBe(400)
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 400,
          error: '"refreshToken" is required',
        }),
      )
    })

    it('should return 400 when refresh token is empty string', async () => {
      const response = await request(app).post('/auth/refresh').send({
        refreshToken: '',
      })

      expect(response.status).toBe(400)
    })

    it('should return 401 when using expired refresh token', async () => {
      // Create an expired refresh token
      const expiredPayload = {
        id: validUser.id,
        name: validUser.name,
        email: validUser.email,
        idDocument: validUser.idDocument,
        type: 'refresh',
      }

      const expiredToken = jwt.sign(expiredPayload, parameters.jwtSecret, { expiresIn: '-1h' })

      const response = await request(app).post('/auth/refresh').send({
        refreshToken: expiredToken,
      })

      expect(response.status).toBe(401)
    })

    it('should return 401 when using malformed refresh token', async () => {
      const response = await request(app).post('/auth/refresh').send({
        refreshToken: 'malformed.token.here',
      })

      expect(response.status).toBe(401)
    })

    it('should return 401 when using refresh token with wrong signature', async () => {
      const wrongSecretPayload = {
        id: validUser.id,
        name: validUser.name,
        email: validUser.email,
        idDocument: validUser.idDocument,
        type: 'refresh',
      }

      const wrongSecretToken = jwt.sign(wrongSecretPayload, 'wrongsecret', { expiresIn: '7d' })

      const response = await request(app).post('/auth/refresh').send({
        refreshToken: wrongSecretToken,
      })

      expect(response.status).toBe(401)
    })

    it('should return 401 when using token without type field', async () => {
      const noTypePayload = {
        id: validUser.id,
        name: validUser.name,
        email: validUser.email,
        idDocument: validUser.idDocument,
      }

      const noTypeToken = jwt.sign(noTypePayload, parameters.jwtSecret, { expiresIn: '7d' })

      const response = await request(app).post('/auth/refresh').send({
        refreshToken: noTypeToken,
      })

      expect(response.status).toBe(401)
    })

    it('should return 401 when using token with wrong type', async () => {
      const wrongTypePayload = {
        id: validUser.id,
        name: validUser.name,
        email: validUser.email,
        idDocument: validUser.idDocument,
        type: 'invalid',
      }

      const wrongTypeToken = jwt.sign(wrongTypePayload, parameters.jwtSecret, { expiresIn: '7d' })

      const response = await request(app).post('/auth/refresh').send({
        refreshToken: wrongTypeToken,
      })

      expect(response.status).toBe(401)
    })
  })

  describe('Token Type Validation E2E', () => {
    it('should not allow using refresh token for protected routes', async () => {
      const response = await request(app).get('/auth/info').set('Authorization', `Bearer ${refreshToken}`)

      expect([401, 403]).toContain(response.status)
    })

    it('should allow using access token for protected routes', async () => {
      // Ensure role exists first
      try {
        const existingRole = await roleRepository.findOne({ name: 'user' })
        if (!existingRole) {
          await roleRepository.create('user')
        }
      } catch (error) {
        try {
          await roleRepository.create('user')
        } catch (createError) {
          console.warn('Could not create user role:', createError)
        }
      }

      // Create a fresh user account for this test to avoid interference
      const signUpResponse = await request(app).post('/auth/signup').send({
        name: 'Test',
        lastName: 'TokenUser',
        email: 'test.token.validation@example.com',
        password: 'password123',
        role: 'user',
        idDocument: '98765432101',
        country: 'Test Country',
        address: 'Test Address',
      })

      if (signUpResponse.status !== 201) {
        throw new Error(`Signup failed: ${JSON.stringify(signUpResponse.body)}`)
      }

      // Login to get fresh tokens
      const loginResponse = await request(app).post('/auth/login').send({
        email: 'test.token.validation@example.com',
        password: 'password123',
      })

      expect(loginResponse.status).toBe(200)
      const freshAccessToken = loginResponse.body.data.token

      const response = await request(app).get('/auth/info').set('Authorization', `Bearer ${freshAccessToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 200,
          message: 'Success',
          data: expect.objectContaining({
            id: expect.any(String),
            email: 'test.token.validation@example.com',
          }),
        }),
      )
    })
  })
})
