import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema/index.js'

function createClient(connectionString: string) {
  const client = postgres(connectionString)
  return drizzle(client, { schema })
}

export { createClient }
export type Database = ReturnType<typeof createClient>
