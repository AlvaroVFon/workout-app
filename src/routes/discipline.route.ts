import { Router } from 'express'
import disciplineController from '../controllers/discipline.controller'
import disciplineMiddleware from '../middlewares/discipline.middleware'
import globalValidatorMiddleware from '../middlewares/globalValidator.middleware'

const router = Router()

router
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
