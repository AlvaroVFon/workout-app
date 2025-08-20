import type { Express } from 'express'
import request from 'supertest'
import { getTestApp } from '../../utils/getApp'

describe('Security Headers Middleware (Helmet)', () => {
  let app: Express

  beforeAll(async () => {
    app = await getTestApp()
  })

  afterAll(() => {})

  it('should include X-DNS-Prefetch-Control header', async () => {
    const response = await request(app).get('/')
    expect(response.headers['x-dns-prefetch-control']).toBe('off')
  })

  it('should include X-Frame-Options header', async () => {
    const response = await request(app).get('/')
    expect(response.headers['x-frame-options']).toBe('SAMEORIGIN')
  })

  it('should include X-Download-Options header', async () => {
    const response = await request(app).get('/')
    expect(response.headers['x-download-options']).toBe('noopen')
  })

  it('should include X-Content-Type-Options header', async () => {
    const response = await request(app).get('/')
    expect(response.headers['x-content-type-options']).toBe('nosniff')
  })

  it('should include X-Permitted-Cross-Domain-Policies header', async () => {
    const response = await request(app).get('/')
    expect(response.headers['x-permitted-cross-domain-policies']).toBe('none')
  })

  it('should include Referrer-Policy header', async () => {
    const response = await request(app).get('/')
    expect(response.headers['referrer-policy']).toBe('no-referrer')
  })

  it('should include X-XSS-Protection header', async () => {
    const response = await request(app).get('/')
    expect(response.headers['x-xss-protection']).toBe('0')
  })

  it('should include Content-Security-Policy header', async () => {
    const response = await request(app).get('/')
    expect(response.headers['content-security-policy']).toContain("default-src 'self'")
  })

  it('should include Strict-Transport-Security header', async () => {
    const response = await request(app).get('/')
    expect(response.headers['strict-transport-security']).toContain('max-age=')
  })

  it('should NOT include X-Powered-By header (removed by Helmet)', async () => {
    const response = await request(app).get('/')
    expect(response.headers['x-powered-by']).toBeUndefined()
  })

  it('should include all security headers in a single request', async () => {
    const response = await request(app).get('/health')

    const securityHeaders = [
      'x-dns-prefetch-control',
      'x-frame-options',
      'x-download-options',
      'x-content-type-options',
      'x-permitted-cross-domain-policies',
      'referrer-policy',
      'x-xss-protection',
      'content-security-policy',
      'strict-transport-security',
    ]

    securityHeaders.forEach((header) => {
      expect(response.headers[header]).toBeDefined()
    })

    expect(response.headers['x-powered-by']).toBeUndefined()

    expect(response.statusCode).toBe(200)
  })
})
