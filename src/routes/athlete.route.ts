import { Router } from 'express'
import athleteController from '../controllers/athlete.controller'
import athleteMiddleware from '../middlewares/athlete.middleware'
import authMiddleware from '../middlewares/auth/auth.middleware'
import disciplineMiddleware from '../middlewares/discipline.middleware'
import globalValidatorMiddleware from '../middlewares/globalValidator.middleware'
import paginationMiddleware from '../middlewares/pagination.middleware'
import { RolesEnum } from '../utils/enums/roles.enum'

const router = Router()

router
  .use(authMiddleware.verifyJWT, authMiddleware.authorizeRoles(RolesEnum.USER, RolesEnum.ADMIN, RolesEnum.SUPERADMIN))
  .get('/', [paginationMiddleware.paginate], athleteController.findAllByCoach)
  .get(
    '/:id',
    [globalValidatorMiddleware.validateObjectId, athleteMiddleware.validateAthleteOwnership],
    athleteController.findOneByCoach,
  )
  .get(
    '/:id/stats',
    [globalValidatorMiddleware.validateObjectId, athleteMiddleware.validateAthleteOwnership],
    athleteController.getStats,
  )
  .post(
    '/',
    [athleteMiddleware.validateCreateAthleteSchema, athleteMiddleware.validateAthleteExistence],
    athleteController.create,
  )
  .patch(
    '/:id',
    [
      globalValidatorMiddleware.validateObjectId,
      athleteMiddleware.validateAthleteOwnership,
      athleteMiddleware.validateUpdateAthleteSchema,
    ],
    athleteController.update,
  )
  .patch(
    '/:id/disciplines',
    [
      globalValidatorMiddleware.validateObjectId,
      athleteMiddleware.validateAthleteOwnership,
      athleteMiddleware.validateUpdateDisciplineSchema,
      disciplineMiddleware.validateDisciplinesExistence,
    ],
    athleteController.update,
  )
  .delete(
    '/:id',
    [globalValidatorMiddleware.validateObjectId, athleteMiddleware.validateAthleteOwnership],
    athleteController.delete,
  )

export { router as athleteRouter }
