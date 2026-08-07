import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { DEFAULT_CONVERSATION_TITLE } from '../../lib/constants.js'

export const conversations = pgTable('conversations', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull(),
	title: varchar('title', { length: 255 }).notNull().default(DEFAULT_CONVERSATION_TITLE),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const messages = pgTable('messages', {
	id: text('id').primaryKey(),
	conversationId: text('conversation_id')
		.notNull()
		.references(() => conversations.id, { onDelete: 'cascade' }),
	role: varchar('role', { length: 50 }).notNull(),
	content: text('content').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
})
