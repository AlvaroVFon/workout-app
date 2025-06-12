import { Router, Request, Response } from 'express'
const router = Router()

router.get('/', (req, res) => {
  res.json({
    message: 'Hello World',
  })
})

router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    date: new Date().toISOString(),
  })
})

export { router as indexRouter }
