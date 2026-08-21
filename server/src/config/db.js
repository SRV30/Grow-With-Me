import mongoose from 'mongoose'
import { env } from './env.js'

let connectionPromise

export const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(env.mongodbUri, {
      dbName: 'gwm',
      serverSelectionTimeoutMS: 10000,
    })
  }

  await connectionPromise
  return mongoose.connection
}

export const disconnectDatabase = async () => {
  connectionPromise = undefined
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
  }
}
