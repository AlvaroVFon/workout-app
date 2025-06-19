import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt'
import userService from '../services/user.service'
import { parameters } from '../config/parameters'
import { PublicUserDTO } from '../DTOs/user/user.public.dto'

const { jwtSecret } = parameters

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
}

export const jwtStrategy = new JwtStrategy(opts, async (payload, done) => {
  try {
    const user = await userService.findById(payload.id)

    if (!user) {
      return done(null, false)
    }
    console.log('JWT', user)

    const publicUser: PublicUserDTO = {
      id: user.id,
      email: user.email,
      name: user.name,
      idDocument: user.idDocument,
      role: user.role.name,
    }

    return done(null, publicUser)
  } catch (error) {
    return done(error, false)
  }
})
