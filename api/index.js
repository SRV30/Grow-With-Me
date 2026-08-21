import app from '../server/src/app.js'
import { connectDatabase } from '../server/src/config/db.js'

let databasePromise

const ensureDatabase = async () => {
  if (!databasePromise) {
    databasePromise = connectDatabase().catch((error) => {
      databasePromise = undefined
      throw error
    })
  }

  return databasePromise
}

export default async function handler(req, res) {
  await ensureDatabase()
  return app(req, res)
}
