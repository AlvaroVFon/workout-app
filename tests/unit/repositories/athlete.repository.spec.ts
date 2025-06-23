import athleteRepository from '../../../src/repositories/athlete.repository'
import Athlete from '../../../src/models/Athlete'
import { CreateAthleteDTO } from '../../../src/DTOs/athlete/create.dto'
import AthleteDTO from '../../../src/DTOs/athlete/athlete.dto'
import { ObjectId } from 'mongodb'

jest.mock('../../../src/models/Athlete')

describe('AthleteRepository', () => {
  const mockAthlete = {
    _id: '123',
    firstname: 'John',
    lastname: 'Doe',
    coach: '456',
    idDocument: 'ID123',
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create an athlete', async () => {
    const createData: CreateAthleteDTO = {
      email: 'john.doe@example.com',
      firstname: 'John',
      lastname: 'Doe',
      coach: '456' as unknown as ObjectId,
      idDocument: 'ID123',
    }
    ;(Athlete.create as jest.Mock).mockResolvedValue(mockAthlete)
    const result = await athleteRepository.create(createData)
    expect(Athlete.create).toHaveBeenCalledWith(createData)
    expect(result).toEqual(mockAthlete)
  })

  it('should find an athlete by ID', async () => {
    ;(Athlete.findOne as jest.Mock).mockResolvedValue(mockAthlete)
    const result = await athleteRepository.findById('123')
    expect(Athlete.findOne).toHaveBeenCalledWith({ _id: '123' }, undefined)
    expect(result).toEqual(mockAthlete)
  })

  it('should find one athlete by filter', async () => {
    const query = { firstname: 'John' }
    ;(Athlete.findOne as jest.Mock).mockResolvedValue(mockAthlete)
    const result = await athleteRepository.findOne({ query })
    expect(Athlete.findOne).toHaveBeenCalledWith(query, {}, {})
    expect(result).toEqual(mockAthlete)
  })

  it('should find all athletes by filter', async () => {
    const query = { coach: '456' }
    ;(Athlete.find as jest.Mock).mockResolvedValue([mockAthlete])
    const result = await athleteRepository.findAll({ query })
    expect(Athlete.find).toHaveBeenCalledWith(query, {}, {})
    expect(result).toEqual([mockAthlete])
  })

  it('should update an athlete', async () => {
    const updateData: Partial<AthleteDTO> = { firstname: 'Jane' }
    ;(Athlete.findOneAndUpdate as jest.Mock).mockResolvedValue({ ...mockAthlete, ...updateData })
    const result = await athleteRepository.update('123', updateData)
    expect(Athlete.findOneAndUpdate).toHaveBeenCalledWith({ _id: '123' }, updateData, { new: true })
    expect(result).toEqual({ ...mockAthlete, ...updateData })
  })

  it('should delete an athlete', async () => {
    ;(Athlete.findOneAndDelete as jest.Mock).mockResolvedValue(mockAthlete)
    const result = await athleteRepository.delete('123')
    expect(Athlete.findOneAndDelete).toHaveBeenCalledWith({ _id: '123' })
    expect(result).toEqual(mockAthlete)
  })

  it('should get total count', async () => {
    ;(Athlete.countDocuments as jest.Mock).mockResolvedValue(5)
    const result = await athleteRepository.getTotal({ coach: '456' })
    expect(Athlete.countDocuments).toHaveBeenCalledWith({ coach: '456' })
    expect(result).toBe(5)
  })
})
