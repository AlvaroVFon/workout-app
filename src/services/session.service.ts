import { ProjectionType } from 'mongoose'
import { CreateSessionDTO } from '../DTOs/session/create.dto'
import { SessionDTO } from '../DTOs/session/session.dto'
import sessionRepository from '../repositories/session.repository'

class SessionService {
  async create(session: CreateSessionDTO): Promise<SessionDTO> {
    return sessionRepository.create(session)
  }

  async findById(id: string, projection: ProjectionType<SessionDTO> = {}): Promise<SessionDTO | null> {
    return sessionRepository.findById(id, projection)
  }

  async findByUserId(userId: string, projection: ProjectionType<SessionDTO> = {}): Promise<SessionDTO | null> {
    return sessionRepository.findByUserId(userId, projection)
  }

  async findAllByUserId(userId: string, projection: ProjectionType<SessionDTO> = {}): Promise<SessionDTO[]> {
    return sessionRepository.findAllByUserId(userId, projection)
  }

  async findActiveByUserId(userId: string, projection: ProjectionType<SessionDTO> = {}): Promise<SessionDTO | null> {
    return sessionRepository.findActiveByUserId(userId, projection)
  }

  async update(id: string, updateData: Partial<SessionDTO>): Promise<SessionDTO | null> {
    return sessionRepository.update(id, updateData)
  }

  async delete(id: string): Promise<SessionDTO | null> {
    return sessionRepository.delete(id)
  }
}

export default new SessionService()
