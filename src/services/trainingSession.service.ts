import { ModelQuery } from '../types/index.types'
import { TrainingSessionDTO } from '../DTOs/trainingSession/trainingSession.dto'
import trainingSessionRepository from '../repositories/trainingSession.repository'
import { RootFilterQuery } from 'mongoose'

class TrainingSessionService {
  create(data: TrainingSessionDTO) {
    return trainingSessionRepository.create(data)
  }

  findOne({ query = {}, projection = {}, options = {} }: ModelQuery<TrainingSessionDTO> = {}) {
    return trainingSessionRepository.findOne({ query, projection, options })
  }

  findAll({ query = {}, projection = {}, options = {} }: ModelQuery<TrainingSessionDTO> = {}) {
    return trainingSessionRepository.findAll({ query, projection, options })
  }

  update(id: string, data: Partial<TrainingSessionDTO>) {
    return trainingSessionRepository.update(id, data)
  }

  delete(id: string) {
    return trainingSessionRepository.delete(id)
  }

  getTotal(query: RootFilterQuery<TrainingSessionDTO> = {}) {
    return trainingSessionRepository.getTotal(query)
  }
}

export default new TrainingSessionService()
