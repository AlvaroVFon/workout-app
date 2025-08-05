import { DisciplineDTO } from '../DTOs/discipline/discipline.dto'
import disciplineRepository from '../repositories/discipline.repository'

class DisciplineService {
  async createDiscipline(discipline: DisciplineDTO): Promise<DisciplineDTO> {
    discipline.createdAt = new Date()
    return disciplineRepository.create(discipline)
  }

  async findById(id: string): Promise<DisciplineDTO | null> {
    return disciplineRepository.findOne({ query: { _id: id } })
  }

  async findAll(): Promise<DisciplineDTO[]> {
    return disciplineRepository.findAll()
  }

  async update(id: string, discipline: Partial<DisciplineDTO>): Promise<DisciplineDTO | null> {
    discipline.updatedAt = new Date()
    return disciplineRepository.update({ _id: id }, discipline)
  }

  async delete(id: string): Promise<DisciplineDTO | null> {
    return disciplineRepository.delete({ _id: id })
  }
}

export default new DisciplineService()
