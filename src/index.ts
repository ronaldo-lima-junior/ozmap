import 'dotenv/config'
import { connectDB } from './config/database'
import { syncJob } from './jobs/sync'
import logger from './utils/logger'

async function main() {
  await connectDB()
  syncJob.start()
  logger.info(
    `Sync service started. Job is scheduled with cron expression: ${process.env.CRON_SCHEDULE}`,
  )
}

main()
