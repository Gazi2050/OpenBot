import { createClient } from './connection.js'
import type { Database } from './connection.js'

let db: Database | null = null

export function getDb(): Database {
	if (!db) throw new Error('Database not initialized. Call initDb() first.')
	return db
}

export function initDb(connectionString: string): Database {
	db = createClient(connectionString)
	return db
}

export * from './schema/index.js'
export type { Database } from './connection.js'
