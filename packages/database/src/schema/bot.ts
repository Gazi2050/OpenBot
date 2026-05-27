import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const bots = pgTable('bots', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('offline'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
