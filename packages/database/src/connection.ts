import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema/index.js'

function createClient(connectionString: string) {
  const sql = neon(connectionString)
  return drizzle({ client: sql, schema })
}

export { createClient }
export type Database = ReturnType<typeof createClient>
