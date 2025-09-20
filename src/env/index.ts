import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  ISP_API_URL: z.url(),
  MONGO_URL: z.url(),
  CRON_SCHEDULE: z.string().default('*/5 * * * *'),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('Invalid enviroment variables.', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
