import { faker } from '@faker-js/faker'
import { SetDTO, TrainingSessionDTO } from '../DTOs/trainingSession/trainingSession.dto'
import { Connection } from 'mongoose'
import { ObjectId } from 'mongodb'
import { TrainingTypeEnum } from '../utils/enums/trainingTypes.enum'

function createSet(set?: SetDTO): SetDTO {
  return {
    reps: set?.reps ?? faker.number.int({ min: 1, max: 20 }),
    weight: set?.weight ?? faker.number.int({ min: 0, max: 200 }),
    rir: set?.rir ?? faker.number.int({ min: 0, max: 5 }),
  }
}

async function createExerciseEntry(db: Connection, sets?: SetDTO[]): Promise<{ exercise: ObjectId; sets: SetDTO[] }> {
  const randomSkip = faker.number.int({ min: 0, max: 10 })
  const exerciseId = await db.collection('exercises').findOne({}, { projection: { _id: 1 }, skip: randomSkip })

  return {
    exercise: exerciseId?._id ?? new ObjectId(),
    sets: sets?.map(createSet) ?? [createSet(), createSet(), createSet()],
  }
}

async function createTrainingSession(
  db: Connection,
  session?: Partial<TrainingSessionDTO>,
): Promise<TrainingSessionDTO> {
  const randomSkip = faker.number.int({ min: 0, max: 10 })
  const athleteId = session?.athlete
    ? null
    : await db.collection('athletes').findOne({}, { projection: { _id: 1 }, skip: randomSkip })
  const exercisesEntries = Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, () => createExerciseEntry(db))

  return {
    athlete: session?.athlete ?? athleteId?._id ?? new ObjectId(),
    name: session?.name ?? faker.lorem.words({ min: 2, max: 5 }),
    date: session?.date ?? faker.date.recent(),
    type: session?.type ?? faker.helpers.arrayElement(Object.values(TrainingTypeEnum)),
    exercises: session?.exercises ?? (await Promise.all(exercisesEntries)),
    notes: session?.notes ?? faker.lorem.sentence(),
    week: session?.week ?? faker.number.int({ min: 1, max: 52 }),
    month: session?.month ?? faker.number.int({ min: 1, max: 12 }),
    year: session?.year ?? faker.number.int({ min: 2000, max: 2024 }),
    tags: session?.tags ?? faker.helpers.arrayElements(['home', 'outdoor', 'gym'], { min: 1, max: 3 }),
    sessionDuration: session?.sessionDuration ?? faker.number.int({ min: 20, max: 120 }),
    perceivedEffort: session?.perceivedEffort ?? faker.number.int({ min: 1, max: 10 }),
  }
}

function createTrainingSessions(length: number = 5, db: Connection): Promise<TrainingSessionDTO[]> {
  return Promise.all(Array.from({ length }, () => createTrainingSession(db)))
}

export { createTrainingSession, createTrainingSessions }
