import { ObjectId } from 'mongodb'
import { PipelineStage, RootFilterQuery } from 'mongoose'
import {
  AthleteStatsDTO,
  AthleteStatsQueryDTO,
  FrequencyStatsDTO,
  MuscleGroupStatsDTO,
  MuscleGroupVolumeByPeriodDTO,
  PeriodStatsDTO,
  ProgressionStatsDTO,
  TrainingTypeDistributionDTO,
  VolumeStatsDTO,
} from '../DTOs/athleteStats/athleteStats.dto'
import { TrainingSessionDTO } from '../DTOs/trainingSession/trainingSession.dto'
import trainingSessionRepository from '../repositories/trainingSession.repository'

class AthleteStatsService {
  async getAthleteStats(athleteId: string, query: AthleteStatsQueryDTO = {}): Promise<AthleteStatsDTO> {
    //TODO: parametrizar tiempo por defecto
    const {
      startDate = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), // 30 días por defecto
      endDate = new Date(),
    } = query

    const baseQuery: RootFilterQuery<TrainingSessionDTO> = {
      athlete: new ObjectId(athleteId),
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }

    const volumeStats = await this.getVolumeStats(baseQuery)
    const frequencyStats = await this.getFrequencyStats(baseQuery, startDate, endDate)
    const trainingTypeDistribution = await this.getTrainingTypeDistribution(baseQuery)
    const periodStats = await this.getPeriodStats(baseQuery, query.period || 'week')

    // TODO: Implementar en siguientes iteraciones
    const progression: ProgressionStatsDTO[] = []
    const muscleGroupStats: MuscleGroupStatsDTO[] = []
    const muscleGroupVolumeByPeriod: MuscleGroupVolumeByPeriodDTO[] = []

    return {
      athleteId: new ObjectId(athleteId),
      dateRange: {
        startDate,
        endDate,
      },
      volume: volumeStats,
      progression,
      frequency: frequencyStats,
      trainingTypeDistribution,
      muscleGroupStats,
      muscleGroupVolumeByPeriod,
      periodStats,
      lastUpdated: new Date(),
    }
  }

  private async getVolumeStats(baseQuery: RootFilterQuery<TrainingSessionDTO>): Promise<VolumeStatsDTO> {
    const pipeline: PipelineStage[] = [
      { $match: baseQuery },
      {
        $unwind: '$exercises',
      },
      {
        $unwind: '$exercises.sets',
      },
      {
        $group: {
          _id: null,
          totalSessions: { $addToSet: '$_id' },
          totalSets: { $sum: 1 },
          totalReps: { $sum: '$exercises.sets.reps' },
          totalWeight: {
            $sum: {
              $multiply: [{ $ifNull: ['$exercises.sets.weight', 0] }, '$exercises.sets.reps'],
            },
          },
          totalDuration: { $sum: { $ifNull: ['$sessionDuration', 0] } },
          totalEffort: { $sum: { $ifNull: ['$perceivedEffort', 0] } },
          effortCount: {
            $sum: {
              $cond: [{ $ne: ['$perceivedEffort', null] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          totalSessions: { $size: '$totalSessions' },
          totalSets: 1,
          totalReps: 1,
          totalWeight: 1,
          averageSessionDuration: {
            $cond: [{ $gt: ['$totalSessions', 0] }, { $divide: ['$totalDuration', { $size: '$totalSessions' }] }, 0],
          },
          averagePerceivedEffort: {
            $cond: [{ $gt: ['$effortCount', 0] }, { $divide: ['$totalEffort', '$effortCount'] }, 0],
          },
        },
      },
    ]

    const result = await trainingSessionRepository.aggregate<VolumeStatsDTO>(pipeline)

    if (result.length === 0) {
      return {
        totalSessions: 0,
        totalSets: 0,
        totalReps: 0,
        totalWeight: 0,
        averageSessionDuration: 0,
        averagePerceivedEffort: 0,
      }
    }

    return result[0]
  }

  private async getFrequencyStats(
    baseQuery: RootFilterQuery<TrainingSessionDTO>,
    startDate: Date,
    endDate: Date,
  ): Promise<FrequencyStatsDTO> {
    const sessions = await trainingSessionRepository.findAll({
      query: baseQuery,
      projection: { date: 1 },
      options: { sort: { date: 1 } },
    })

    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const totalWeeks = Math.ceil(totalDays / 7)
    const totalMonths = Math.ceil(totalDays / 30)

    const sessionDates = sessions.map((s) => new Date(s.date).toDateString())
    const uniqueTrainingDays = new Set(sessionDates).size

    // Calcular rachas (simplified for now)
    const currentStreak = 0
    const longestStreak = 0
    // TODO: Implementar lógica de rachas más sofisticada

    return {
      dailyAverage: totalDays > 0 ? sessions.length / totalDays : 0,
      weeklyAverage: totalWeeks > 0 ? sessions.length / totalWeeks : 0,
      monthlyAverage: totalMonths > 0 ? sessions.length / totalMonths : 0,
      trainingDaysPerWeek: totalWeeks > 0 ? (uniqueTrainingDays * 7) / totalDays : 0,
      longestStreak,
      currentStreak,
    }
  }

  private async getTrainingTypeDistribution(
    baseQuery: RootFilterQuery<TrainingSessionDTO>,
  ): Promise<TrainingTypeDistributionDTO[]> {
    const pipeline: PipelineStage[] = [
      { $match: baseQuery },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          types: { $push: { type: '$_id', count: '$count' } },
          total: { $sum: '$count' },
        },
      },
      {
        $unwind: '$types',
      },
      {
        $project: {
          type: '$types.type',
          count: '$types.count',
          percentage: {
            $multiply: [{ $divide: ['$types.count', '$total'] }, 100],
          },
        },
      },
    ]

    return await trainingSessionRepository.aggregate(pipeline)
  }

  private async getPeriodStats(
    baseQuery: RootFilterQuery<TrainingSessionDTO>,
    period: 'week' | 'month' | 'year',
  ): Promise<PeriodStatsDTO[]> {
    const groupBy = period === 'week' ? '$week' : period === 'month' ? '$month' : '$year'

    const pipeline: PipelineStage[] = [
      { $match: baseQuery },
      {
        $unwind: '$exercises',
      },
      {
        $unwind: '$exercises.sets',
      },
      {
        $group: {
          _id: {
            period: groupBy,
            year: '$year',
          },
          sessions: { $addToSet: '$_id' },
          totalWeight: {
            $sum: {
              $multiply: [{ $ifNull: ['$exercises.sets.weight', 0] }, '$exercises.sets.reps'],
            },
          },
          totalEffort: { $sum: { $ifNull: ['$perceivedEffort', 0] } },
          effortCount: {
            $sum: {
              $cond: [{ $ne: ['$perceivedEffort', null] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          period: period,
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: period === 'month' ? '$_id.period' : 1,
              day: 1,
            },
          },
          sessions: { $size: '$sessions' },
          totalWeight: 1,
          averageEffort: {
            $cond: [{ $gt: ['$effortCount', 0] }, { $divide: ['$totalEffort', '$effortCount'] }, 0],
          },
        },
      },
      { $sort: { date: 1 } },
    ]

    return await trainingSessionRepository.aggregate(pipeline)
  }
}

export default new AthleteStatsService()
