import type { ProjectionType } from 'mongoose'
import type { ModelQuery } from '../types/index.types'
import { CreateSessionDTO } from '../DTOs/session/create.dto'
import { SessionDTO } from '../DTOs/session/session.dto'
import Session from '../models/Session'

//TODO: simplify repository methods by using a generic base repository
class SessionRepository {
  create(session: CreateSessionDTO): Promise<SessionDTO> {
    return Session.create(session)
  }

  findOne({ query = {}, projection = {}, options = {} }: ModelQuery<SessionDTO>) {
    return Session.findOne(query, projection, options).exec()
  }

  findById(id: string, projection: ProjectionType<SessionDTO> = {}): Promise<SessionDTO | null> {
    return Session.findById({ _id: id }, projection).exec()
  }

  findByUserId(userId: string, projection: ProjectionType<SessionDTO> = {}): Promise<SessionDTO | null> {
    return Session.findOne({ userId }, projection).exec()
  }

  findAllByUserId(userId: string, projection: ProjectionType<SessionDTO> = {}): Promise<SessionDTO[]> {
    return Session.find({ userId }, projection).exec()
  }

  findActiveByUserId(userId: string, projection: ProjectionType<SessionDTO> = {}): Promise<SessionDTO | null> {
    return Session.findOne({ userId, isActive: true }, projection).exec()
  }

  update(id: string, updateData: Partial<SessionDTO>): Promise<SessionDTO | null> {
    return Session.findByIdAndUpdate(id, updateData, { new: true }).exec()
  }

  delete(id: string): Promise<SessionDTO | null> {
    return Session.findByIdAndDelete(id).exec()
  }
}

export default new SessionRepository()
