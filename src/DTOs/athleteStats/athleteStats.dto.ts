import { ObjectId } from 'mongodb'

export interface VolumeStatsDTO {
  totalSessions: number
  totalSets: number
  totalReps: number
  totalWeight: number
  averageSessionDuration: number
  averagePerceivedEffort: number
}

export interface ProgressionStatsDTO {
  exerciseId: ObjectId
  exerciseName: string
  firstRecord: {
    date: Date
    weight: number
    reps: number
  }
  latestRecord: {
    date: Date
    weight: number
    reps: number
  }
  progressionPercentage: number
  totalSessions: number
}

export interface FrequencyStatsDTO {
  dailyAverage: number
  weeklyAverage: number
  monthlyAverage: number
  trainingDaysPerWeek: number
  longestStreak: number
  currentStreak: number
}

export interface TrainingTypeDistributionDTO {
  type: string
  count: number
  percentage: number
}

export interface MuscleGroupStatsDTO {
  muscleGroupId: ObjectId
  muscleGroupName: string
  totalSets: number
  totalReps: number
  totalWeight: number
  averageIntensity: number
  sessionCount: number
  lastTrained: Date
}

export interface MuscleGroupVolumeByPeriodDTO {
  muscleGroupId: ObjectId
  muscleGroupName: string
  periods: Array<{
    period: string // 'week', 'month', 'year'
    date: Date
    totalWeight: number
    totalSets: number
    totalReps: number
    sessionCount: number
  }>
}

export interface PeriodStatsDTO {
  period: string // 'week', 'month', 'year'
  date: Date
  sessions: number
  totalWeight: number
  averageEffort: number
}

export interface AthleteStatsDTO {
  athleteId: ObjectId
  dateRange: {
    startDate: Date
    endDate: Date
  }
  volume: VolumeStatsDTO
  progression: ProgressionStatsDTO[]
  frequency: FrequencyStatsDTO
  trainingTypeDistribution: TrainingTypeDistributionDTO[]
  muscleGroupStats: MuscleGroupStatsDTO[]
  muscleGroupVolumeByPeriod: MuscleGroupVolumeByPeriodDTO[]
  periodStats: PeriodStatsDTO[]
  lastUpdated: Date
}

export interface AthleteStatsQueryDTO {
  startDate?: Date
  endDate?: Date
  period?: 'week' | 'month' | 'year'
  exerciseIds?: ObjectId[]
  muscleGroupIds?: ObjectId[]
  trainingTypes?: string[]
  includeMuscleGroupBreakdown?: boolean
}
