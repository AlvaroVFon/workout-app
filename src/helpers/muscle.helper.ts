import muscleRepository from '../repositories/muscle.repository'

async function areValidMuscles(muscles: string[]): Promise<boolean> {
  const dbMuscles = await muscleRepository.findAll({ name: 1 })
  return dbMuscles.every((muscle) => muscles.includes(muscle))
}

export { areValidMuscles }
