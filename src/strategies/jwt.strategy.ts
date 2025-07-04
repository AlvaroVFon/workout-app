import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt'
import { parameters } from '../config/parameters'
import { PublicUserDTO } from '../DTOs/user/user.public.dto'
import userService from '../services/user.service'

const { jwtSecret } = parameters

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
}

export const jwtStrategy = new JwtStrategy(opts, async (payload, done) => {
  try {
    const user = await userService.findById(payload.id)

    if (!user || payload.type !== 'access') {
      return done(null, false)
    }

    const publicUser: PublicUserDTO = {
      id: user.id,
      name: user.name,
      email: user.email,
      idDocument: user.idDocument,
      role: user.role.name,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return done(null, publicUser)
  } catch (error) {
    return done(error, false)
  }
})
