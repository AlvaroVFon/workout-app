import { ProjectionType, QueryOptions } from 'mongoose'
import { CreateSessionDTO } from '../DTOs/session/create.dto'
import { SessionDTO } from '../DTOs/session/session.dto'
import sessionRepository from '../repositories/session.repository'

//TODO: remake this service with changes made in session.repository
class SessionService {
  async create(session: CreateSessionDTO): Promise<SessionDTO> {
    return sessionRepository.create(session)
  }

  async findById(
    id: string,
    projection: ProjectionType<SessionDTO> = {},
    options: QueryOptions = {},
  ): Promise<SessionDTO | null> {
    return sessionRepository.findById(id, projection, options)
  }

  async findByUserId(
    userId: string,
    projection: ProjectionType<SessionDTO> = {},
    options: QueryOptions = {},
  ): Promise<SessionDTO | null> {
    return sessionRepository.findOne({ query: { userId }, projection, options })
  }

  async findAllByUserId(
    userId: string,
    projection: ProjectionType<SessionDTO> = {},
    options: QueryOptions = {},
  ): Promise<SessionDTO[]> {
    return sessionRepository.findAll({ query: { userId }, projection, options })
  }

  async findActiveByUserId(
    userId: string,
    projection: ProjectionType<SessionDTO> = {},
    options: QueryOptions = {},
  ): Promise<SessionDTO | null> {
    return sessionRepository.findOne({ query: { userId, isActive: true }, projection, options })
  }

  async update(id: string, updateData: Partial<SessionDTO>): Promise<SessionDTO | null> {
    return sessionRepository.update(id, updateData)
  }

  async delete(id: string): Promise<SessionDTO | null> {
    return sessionRepository.delete(id)
  }

  async findByRefreshTokenHash(
    refreshTokenHash: string,
    projection: ProjectionType<SessionDTO> = {},
  ): Promise<SessionDTO | null> {
    return sessionRepository.findOne({ query: { refreshTokenHash }, projection })
  }
}

export default new SessionService()
