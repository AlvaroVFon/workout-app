import { Express } from 'express'
import logger from '../utils/logger'

class Server {
  constructor(
    readonly port: number,
    readonly app: Express,
    readonly configureMiddlewares: (app: Express) => void,
    readonly configureRoutes: (app: Express) => void,
    readonly connectDatabase: () => Promise<void>,
    readonly connectCache: () => Promise<void>,
  ) {
    this.port = port
    this.app = app
    this.configureMiddlewares(this.app)
    this.configureRoutes(this.app)
  }

  async start(): Promise<void> {
    try {
      await this.connectDatabase()
      await this.connectCache()

      this.app.listen(this.port, () => {
        logger.info(`Server started on port: ${this.port}`)
      })
    } catch (error) {
      logger.error(`Error starting server: ${error}`)
    }
  }
}

export default Server
