

import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import { ENV } from '../config/env'
import * as schema from './schema'

if (!ENV.DB_URL) {
  throw new Error("DB_URL is not set in env variables")
}

const pool = new pg.Pool({
  connectionString: ENV.DB_URL
})

pool.on("connect", () => {
  console.log("Database connected successfully")
})

pool.on("error", (err) => {
  console.error("Database connection error: ", err)
})

export const db = drizzle({ client: pool, schema })