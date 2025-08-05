import { DisciplineCategoryEnum } from '../utils/enums/discipline-category.enum'
import { DisciplineEnum } from '../utils/enums/discipline.enum'

export const disciplineMocks = [
  { name: DisciplineEnum.ATHLETICS, categories: [DisciplineCategoryEnum.ENDURANCE] },
  { name: DisciplineEnum.SWIMMING, categories: [DisciplineCategoryEnum.AQUATIC, DisciplineCategoryEnum.ENDURANCE] },
  { name: DisciplineEnum.CYCLING, categories: [DisciplineCategoryEnum.ENDURANCE] },
  { name: DisciplineEnum.FOOTBALL, categories: [DisciplineCategoryEnum.TEAM, DisciplineCategoryEnum.ENDURANCE] },
  { name: DisciplineEnum.BASKETBALL, categories: [DisciplineCategoryEnum.TEAM] },
  { name: DisciplineEnum.TENNIS, categories: [DisciplineCategoryEnum.RACKET] },
  { name: DisciplineEnum.VOLLEYBALL, categories: [DisciplineCategoryEnum.TEAM] },
  { name: DisciplineEnum.GYMNASTICS, categories: [DisciplineCategoryEnum.GYMNASTIC] },
  { name: DisciplineEnum.BOXING, categories: [DisciplineCategoryEnum.COMBAT, DisciplineCategoryEnum.STRENGTH] },
  { name: DisciplineEnum.JUDO, categories: [DisciplineCategoryEnum.COMBAT] },
  { name: DisciplineEnum.WEIGHTLIFTING, categories: [DisciplineCategoryEnum.STRENGTH] },
  { name: DisciplineEnum.POWERLIFTING, categories: [DisciplineCategoryEnum.STRENGTH] },
  {
    name: DisciplineEnum.CALISTHENICS,
    categories: [DisciplineCategoryEnum.GYMNASTIC, DisciplineCategoryEnum.STRENGTH],
  },
  { name: DisciplineEnum.CROSSFIT, categories: [DisciplineCategoryEnum.STRENGTH, DisciplineCategoryEnum.ENDURANCE] },
  { name: DisciplineEnum.RUGBY, categories: [DisciplineCategoryEnum.TEAM, DisciplineCategoryEnum.STRENGTH] },
  { name: DisciplineEnum.BASEBALL, categories: [DisciplineCategoryEnum.TEAM] },
  { name: DisciplineEnum.KARATE, categories: [DisciplineCategoryEnum.COMBAT] },
  { name: DisciplineEnum.TAEKWONDO, categories: [DisciplineCategoryEnum.COMBAT] },
  { name: DisciplineEnum.CLIMBING, categories: [DisciplineCategoryEnum.GYMNASTIC, DisciplineCategoryEnum.STRENGTH] },
  { name: DisciplineEnum.OTHER, categories: [DisciplineCategoryEnum.OTHER] },
]
