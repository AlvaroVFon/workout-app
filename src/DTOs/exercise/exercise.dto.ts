import Muscle from '../muscle/muscle.dto'

interface Exercise {
  id: string
  name: string
  description: string
  muscles: Partial<Muscle>[]
  difficulty: string
}

export default Exercise
