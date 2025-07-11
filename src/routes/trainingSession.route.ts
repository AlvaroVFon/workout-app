import { Router } from 'express'
import authMiddleware from '../middlewares/auth/auth.middleware'
import { RolesEnum } from '../utils/enums/roles.enum'
import globalValidatorMiddleware from '../middlewares/globalValidator.middleware'
import paginationMiddleware from '../middlewares/pagination.middleware'
import trainingSessionController from '../controllers/trainingSession.controller'
import athleteMiddleware from '../middlewares/athlete.middleware'
import trainingSessionMiddleware from '../middlewares/trainingSession.middleware'

const router = Router()

router
  .use(authMiddleware.verifyJWT, authMiddleware.authorizeRoles(RolesEnum.ADMIN, RolesEnum.SUPERADMIN, RolesEnum.USER))
  .get(
    '/athlete/:id',
    [
      globalValidatorMiddleware.validateObjectId,
      athleteMiddleware.validateAthleteOwnership,
      paginationMiddleware.paginate,
    ],
    trainingSessionController.findAllByAthlete,
  )
  .get(
    '/:id',
    [globalValidatorMiddleware.validateObjectId, athleteMiddleware.validateAthleteOwnership],
    trainingSessionController.findById,
  )
  .post('/', [trainingSessionMiddleware.validateCreateTrainingSessionSchema], trainingSessionController.create)

export { router as trainingSessionRouter }
