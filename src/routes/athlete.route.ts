import { Router } from 'express'
import athleteController from '../controllers/athlete.controller'
import athleteMiddleware from '../middlewares/athlete.middleware'
import authMiddleware from '../middlewares/auth.middleware'
import { RolesEnum } from '../utils/enums/roles.enum'
import paginationMiddleware from '../middlewares/pagination.middleware'
import globalValidatorMiddleware from '../middlewares/globalValidator.middleware'

const router = Router()

router
  .use(authMiddleware.verifyJWT, authMiddleware.authorizeRoles(RolesEnum.USER, RolesEnum.ADMIN, RolesEnum.SUPERADMIN))
  .get('/', [paginationMiddleware.paginate], athleteController.findAllByCoach)
  .get(
    '/:id',
    [globalValidatorMiddleware.validateObjectId, athleteMiddleware.validateAthleteOwnership],
    athleteController.findOneByCoach,
  )
  .post(
    '/',
    [athleteMiddleware.checkCreateAthleteSchema, athleteMiddleware.validateAthleteExistence],
    athleteController.create,
  )
  .patch(
    '/:id',
    [
      globalValidatorMiddleware.validateObjectId,
      athleteMiddleware.validateAthleteOwnership,
      athleteMiddleware.checkUpdateAthleteSchema,
    ],
    athleteController.update,
  )
  .delete(
    '/:id',
    [globalValidatorMiddleware.validateObjectId, athleteMiddleware.validateAthleteOwnership],
    athleteController.delete,
  )

export { router as athleteRouter }
