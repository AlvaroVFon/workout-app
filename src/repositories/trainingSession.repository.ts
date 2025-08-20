import { AggregateOptions, PipelineStage, ProjectionType, RootFilterQuery } from 'mongoose'
import { TrainingSessionDTO } from '../DTOs/trainingSession/trainingSession.dto'
import TrainingSession from '../models/TrainingSession'
import { ModelQuery } from '../types/index.types'

class TrainingSessionRepository {
  create(data: TrainingSessionDTO) {
    return TrainingSession.create(data)
  }

  findById(id: string, projection?: ProjectionType<TrainingSessionDTO>) {
    return TrainingSession.findOne({ _id: id }, projection)
  }

  findOne({ query = {}, projection = {}, options = {} }: ModelQuery<TrainingSessionDTO>) {
    return TrainingSession.findOne(query, projection, options)
  }

  findAll({ query = {}, projection = {}, options = {} }: ModelQuery<TrainingSessionDTO>) {
    return TrainingSession.find(query, projection, options)
  }

  update(id: string, data: Partial<TrainingSessionDTO>) {
    return TrainingSession.findOneAndUpdate({ _id: id }, data, { new: true })
  }

  delete(id: string) {
    return TrainingSession.findOneAndDelete({ _id: id })
  }

  getTotal(query: RootFilterQuery<TrainingSessionDTO> = {}) {
    return TrainingSession.countDocuments(query)
  }

  aggregate<T>(pipeline: PipelineStage[], options?: AggregateOptions) {
    return TrainingSession.aggregate<T>(pipeline, options)
  }
}

export default new TrainingSessionRepository()
