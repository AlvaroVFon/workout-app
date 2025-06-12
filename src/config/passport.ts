import passport from 'passport'
import { jwtStrategy } from '../strategies/jwt.strategy'

passport.use(jwtStrategy)

export default passport
