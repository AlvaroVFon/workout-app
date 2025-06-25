import { faker } from '@faker-js/faker'
import { Connection } from 'mongoose'
import { ObjectId } from 'mongodb'
import { CreateAthleteDTO } from '../DTOs/athlete/create.dto'
import { GenderEnum } from '../utils/enums/gender.enum'

async function createAthlete(db: Connection, athlete?: CreateAthleteDTO): Promise<CreateAthleteDTO> {
  const randomSkip = faker.number.int({ min: 0, max: 10 })
  const coach = athlete?.coach
    ? null
    : await db.collection('users').findOne({}, { projection: { _id: 1 }, skip: randomSkip })

  return {
    email: athlete?.email ?? faker.internet.email(),
    firstname: athlete?.firstname ?? faker.person.firstName(),
    lastname: athlete?.lastname ?? faker.person.lastName(),
    coach: athlete?.coach ?? coach?._id ?? new ObjectId(),
    idDocument: athlete?.idDocument ?? faker.string.uuid(),
    gender: athlete?.gender ?? faker.helpers.arrayElement(Object.values(GenderEnum)),
    height: athlete?.height ?? faker.number.int({ min: 150, max: 200 }),
    weight: athlete?.weight ?? faker.number.int({ min: 50, max: 200 }),
    goals:
      athlete?.goals ?? faker.helpers.arrayElements(['build muscle', 'fat loss', 'performance'], { min: 1, max: 3 }),
    notes: athlete?.notes ?? faker.lorem.sentence(),
    phone: athlete?.phone ?? faker.phone.number(),
  }
}

async function createAthletes(length: number = 5, db: Connection): Promise<CreateAthleteDTO[]> {
  return Promise.all(Array.from({ length }, () => createAthlete(db)))
}

export { createAthlete, createAthletes }
