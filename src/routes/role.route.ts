import { Router } from 'express'
import roleController from '../controllers/role.controller'
import roleMiddleware from '../middlewares/role.middleware'

const router = Router()

router
  .get('/:id', roleController.findById)
  .post('/', [roleMiddleware.checkCreateRoleSchema], roleController.create)
  .delete('/:id', roleController.delete)

export { router as roleRouter }
