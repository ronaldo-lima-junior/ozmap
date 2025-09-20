import mongoose from 'mongoose'
import logger from '../utils/logger'
import { env } from '../env'

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URL)
    logger.info('MongoDB connected successfully.')
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error)
    process.exit(1)
  }
}
