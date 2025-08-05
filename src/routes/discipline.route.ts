import { Router } from 'express'
import authMiddleware from '../middlewares/auth/auth.middleware'
import disciplineController from '../controllers/discipline.controller'
import disciplineMiddleware from '../middlewares/discipline.middleware'
import globalValidatorMiddleware from '../middlewares/globalValidator.middleware'

const router = Router()

router
  .use(authMiddleware.verifyJWT, authMiddleware.authorizeRoles('ADMIN', 'SUPERADMIN'))
  .post('/', [disciplineMiddleware.validateCreateDiscipline], disciplineController.create)
  .get('/', disciplineController.findAll)
  .get('/:id', [globalValidatorMiddleware.validateObjectId], disciplineController.findById)
  .patch(
    '/:id',
    [globalValidatorMiddleware.validateObjectId, disciplineMiddleware.validateUpdateDiscipline],
    disciplineController.update,
  )
  .delete('/:id', [globalValidatorMiddleware.validateObjectId], disciplineController.delete)

export { router as disciplineRouter }
