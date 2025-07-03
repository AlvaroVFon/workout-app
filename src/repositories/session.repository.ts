import { ProjectionType } from 'mongoose'
import { CreateSessionDTO } from '../DTOs/session/create.dto'
import { SessionDTO } from '../DTOs/session/session.dto'
import Session from '../models/Session'

class SessionRepository {
  create(session: CreateSessionDTO): Promise<SessionDTO> {
    return Session.create(session)
  }

  findById(id: string, projection: ProjectionType<SessionDTO> = {}): Promise<SessionDTO | null> {
    return Session.findById({ _id: id }, projection).populate('user').exec()
  }

  findByUserId(userId: string, projection: ProjectionType<SessionDTO> = {}): Promise<SessionDTO | null> {
    return Session.findOne({ userId }, projection).populate('user').exec()
  }

  findAllByUserId(userId: string, projection: ProjectionType<SessionDTO> = {}): Promise<SessionDTO[]> {
    return Session.find({ userId }, projection).populate('user').exec()
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
