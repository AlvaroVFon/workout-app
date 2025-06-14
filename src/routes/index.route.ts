import { Router, Request, Response } from 'express'
const router = Router()
import packageJson from '../../package.json'

router.get('/', (req, res) => {
  res.json({
    service: packageJson.name,
    version: packageJson.version,
    author: packageJson.author,
  })
})

router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    date: new Date().toISOString(),
    service: packageJson.name,
    version: packageJson.version,
  })
})

export { router as indexRouter }
