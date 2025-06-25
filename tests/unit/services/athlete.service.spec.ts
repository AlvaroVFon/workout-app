import athleteService from '../../../src/services/athlete.service'
import athleteRepository from '../../../src/repositories/athlete.repository'
import { ObjectId } from 'mongodb'
import { CreateAthleteDTO } from '../../../src/DTOs/athlete/create.dto'

jest.mock('../../../src/repositories/athlete.repository')

describe('AthleteService', () => {
  const coachId = new ObjectId()
  const athleteData: CreateAthleteDTO = {
    email: 'athlete@example.com',
    firstname: 'Jane',
    lastname: 'Doe',
    coach: coachId,
    idDocument: 'ID456',
  }
  const athleteMock = { ...athleteData, _id: 'athleteId' }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create an athlete', async () => {
    ;(athleteRepository.create as jest.Mock).mockResolvedValue(athleteMock)
    const result = await athleteService.create({ ...athleteData }, coachId)
    expect(athleteRepository.create).toHaveBeenCalledWith({ ...athleteData, coach: coachId })
    expect(result).toEqual(athleteMock)
  })

  it('should find one athlete', async () => {
    ;(athleteRepository.findOne as jest.Mock).mockResolvedValue(athleteMock)
    const result = await athleteService.findOne({ query: { email: athleteData.email } })
    expect(athleteRepository.findOne).toHaveBeenCalledWith({
      query: { email: athleteData.email },
      projection: {},
      options: {},
    })
    expect(result).toEqual(athleteMock)
  })

  it('should find one athlete with default empty parameters', async () => {
    ;(athleteRepository.findOne as jest.Mock).mockResolvedValue(athleteMock)
    const result = await athleteService.findOne()
    expect(athleteRepository.findOne).toHaveBeenCalledWith({
      query: {},
      projection: {},
      options: {},
    })
    expect(result).toEqual(athleteMock)
  })

  it('should find one athlete with custom projection and options', async () => {
    const query = { coach: coachId }
    const projection = { firstname: 1, lastname: 1 }
    const options = { sort: { firstname: 1 } }
    ;(athleteRepository.findOne as jest.Mock).mockResolvedValue(athleteMock)
    const result = await athleteService.findOne({ query, projection, options })
    expect(athleteRepository.findOne).toHaveBeenCalledWith({
      query,
      projection,
      options,
    })
    expect(result).toEqual(athleteMock)
  })

  it('should find all athletes', async () => {
    ;(athleteRepository.findAll as jest.Mock).mockResolvedValue([athleteMock])
    const result = await athleteService.findAll({ query: { coach: coachId } })
    expect(athleteRepository.findAll).toHaveBeenCalledWith({ query: { coach: coachId }, projection: {}, options: {} })
    expect(result).toEqual([athleteMock])
  })

  it('should find all athletes with default empty parameters', async () => {
    ;(athleteRepository.findAll as jest.Mock).mockResolvedValue([athleteMock])
    const result = await athleteService.findAll()
    expect(athleteRepository.findAll).toHaveBeenCalledWith({ query: {}, projection: {}, options: {} })
    expect(result).toEqual([athleteMock])
  })

  it('should find all athletes with custom projection and options', async () => {
    const query = { coach: coachId }
    const projection = { firstname: 1, lastname: 1 }
    const options = { sort: { firstname: 1 }, limit: 10 }
    ;(athleteRepository.findAll as jest.Mock).mockResolvedValue([athleteMock])
    const result = await athleteService.findAll({ query, projection, options })
    expect(athleteRepository.findAll).toHaveBeenCalledWith({ query, projection, options })
    expect(result).toEqual([athleteMock])
  })

  it('should update an athlete', async () => {
    ;(athleteRepository.update as jest.Mock).mockResolvedValue({ ...athleteMock, firstname: 'Updated' })
    const result = await athleteService.update('athleteId', { firstname: 'Updated' })
    expect(athleteRepository.update).toHaveBeenCalledWith('athleteId', { firstname: 'Updated' })
    expect(result).toEqual({ ...athleteMock, firstname: 'Updated' })
  })

  it('should delete an athlete', async () => {
    ;(athleteRepository.delete as jest.Mock).mockResolvedValue(true)
    const result = await athleteService.delete('athleteId')
    expect(athleteRepository.delete).toHaveBeenCalledWith('athleteId')
    expect(result).toBe(true)
  })

  it('should get total athletes', async () => {
    ;(athleteRepository.getTotal as jest.Mock).mockResolvedValue(10)
    const total = await athleteService.getTotal({ coach: coachId })
    expect(athleteRepository.getTotal).toHaveBeenCalledWith({ coach: coachId })
    expect(total).toBe(10)
  })

  it('should get total athletes with default empty query', async () => {
    ;(athleteRepository.getTotal as jest.Mock).mockResolvedValue(25)
    const total = await athleteService.getTotal()
    expect(athleteRepository.getTotal).toHaveBeenCalledWith({})
    expect(total).toBe(25)
  })
})
