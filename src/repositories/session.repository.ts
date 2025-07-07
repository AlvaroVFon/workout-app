import type { ProjectionType, QueryOptions } from 'mongoose'
import { CreateSessionDTO } from '../DTOs/session/create.dto'
import { SessionDTO } from '../DTOs/session/session.dto'
import Session from '../models/Session'
import type { ModelQuery } from '../types/index.types'

class SessionRepository {
  create(session: CreateSessionDTO): Promise<SessionDTO> {
    return Session.create(session)
  }

  findOne({ query = {}, projection = {}, options = {} }: ModelQuery<SessionDTO>) {
    return Session.findOne(query, projection, options).exec()
  }

  findById(
    id: string,
    projection: ProjectionType<SessionDTO> = {},
    options: QueryOptions = {},
  ): Promise<SessionDTO | null> {
    return Session.findById(id, projection, options).exec()
  }

  findAll({ query = {}, projection = {}, options = {} }: ModelQuery<SessionDTO>): Promise<SessionDTO[]> {
    return Session.find(query, projection, options).exec()
  }

  update(id: string, updateData: Partial<SessionDTO>): Promise<SessionDTO | null> {
    return Session.findByIdAndUpdate(id, updateData, { new: true }).exec()
  }

  delete(id: string): Promise<SessionDTO | null> {
    return Session.findByIdAndDelete(id).exec()
  }
}

export default new SessionRepository()
