import { Hono } from 'hono'
import { getAuth } from '@clerk/hono'
import { eq, desc } from 'drizzle-orm'
import type { ApiResponse } from '@openbot/shared'
import type { Conversation, Message } from '@openbot/shared'
import { getDb } from '../db/index.js'
import { conversations, messages } from '../db/schema/index.js'
import { DEFAULT_CONVERSATION_TITLE, ERROR_UNAUTHORIZED, ERROR_NOT_FOUND } from '../lib/constants.js'

const app = new Hono()

function errorResponse(message: string, status: number) {
	return Response.json({ success: false, error: message }, { status })
}

app.post('/', async (c) => {
	const { userId } = getAuth(c)
	if (!userId) return errorResponse(ERROR_UNAUTHORIZED, 401)

	const { title } = await c.req.json<{ title?: string }>()
	const id = crypto.randomUUID()
	const now = new Date()
	const effectiveTitle = title?.slice(0, 255) || DEFAULT_CONVERSATION_TITLE

	const db = getDb()
	await db.insert(conversations).values({
		id,
		userId,
		title: effectiveTitle,
	})

	return c.json<ApiResponse<Conversation>>({
		success: true,
		data: { id, userId, title: effectiveTitle, createdAt: now, updatedAt: now },
	}, 201)
})

app.get('/', async (c) => {
	const { userId } = getAuth(c)
	if (!userId) return errorResponse(ERROR_UNAUTHORIZED, 401)

	const db = getDb()
	const rows = await db
		.select()
		.from(conversations)
		.where(eq(conversations.userId, userId))
		.orderBy(desc(conversations.updatedAt))

	return c.json<ApiResponse<Conversation[]>>({ success: true, data: rows })
})

app.get('/:id', async (c) => {
	const { userId } = getAuth(c)
	if (!userId) return errorResponse(ERROR_UNAUTHORIZED, 401)

	const db = getDb()
	const id = c.req.param('id')

	const [conversation] = await db
		.select()
		.from(conversations)
		.where(eq(conversations.id, id))
		.limit(1)

	if (!conversation || conversation.userId !== userId) {
		return errorResponse(ERROR_NOT_FOUND, 404)
	}

	const rows = await db
		.select()
		.from(messages)
		.where(eq(messages.conversationId, id))
		.orderBy(messages.createdAt)

	const msgs: Message[] = rows.map((row) => ({
		id: row.id,
		conversationId: row.conversationId,
		role: row.role as 'user' | 'assistant',
		content: row.content,
		createdAt: row.createdAt,
	}))

	return c.json<ApiResponse<{ conversation: Conversation; messages: Message[] }>>({
		success: true,
		data: { conversation, messages: msgs },
	})
})

app.delete('/:id', async (c) => {
	const { userId } = getAuth(c)
	if (!userId) return errorResponse(ERROR_UNAUTHORIZED, 401)

	const db = getDb()
	const id = c.req.param('id')

	const [conversation] = await db
		.select()
		.from(conversations)
		.where(eq(conversations.id, id))
		.limit(1)

	if (!conversation || conversation.userId !== userId) {
		return errorResponse(ERROR_NOT_FOUND, 404)
	}

	await db.delete(conversations).where(eq(conversations.id, id))

	return c.json<ApiResponse<{ success: boolean }>>({ success: true, data: { success: true } })
})

export default app
