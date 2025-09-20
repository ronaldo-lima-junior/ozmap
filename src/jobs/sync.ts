import cron from 'node-cron'
import { syncService } from '../services/sync'
import logger from '../utils/logger'
import { env } from '../env'

const schedule = env.CRON_SCHEDULE

export const syncJob = cron.schedule(schedule, () => {
  logger.info(`Cron job triggered with schedule: ${schedule}`)
  syncService.run()
})
