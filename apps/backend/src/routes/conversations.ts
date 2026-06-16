import { Hono } from 'hono'
import { getAuth } from '@clerk/hono'
import { eq, desc } from 'drizzle-orm'
import type { ApiResponse, Conversation, Message } from '@openbot/shared'
import { getDb } from '../db/index.js'
import { conversations, messages } from '../db/schema/index.js'

const app = new Hono()

app.post('/', async (c) => {
	const { userId } = getAuth(c)
	if (!userId) return c.json<ApiResponse<never>>({ success: false, error: 'Unauthorized' } as ApiResponse<never>, 401)

	const { title } = await c.req.json<{ title?: string }>()
	const id = crypto.randomUUID()
	const now = new Date()

	const db = getDb()
	await db.insert(conversations).values({
		id,
		userId,
		title: title?.slice(0, 255) || 'New Chat',
	})

	return c.json<ApiResponse<Conversation>>({
		success: true,
		data: { id, userId, title: title?.slice(0, 255) || 'New Chat', createdAt: now, updatedAt: now },
	}, 201)
})

app.get('/', async (c) => {
	const { userId } = getAuth(c)
	if (!userId) return c.json<ApiResponse<never>>({ success: false, error: 'Unauthorized' } as ApiResponse<never>, 401)

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
	if (!userId) return c.json<ApiResponse<never>>({ success: false, error: 'Unauthorized' } as ApiResponse<never>, 401)

	const db = getDb()
	const id = c.req.param('id')

	const [conversation] = await db
		.select()
		.from(conversations)
		.where(eq(conversations.id, id))
		.limit(1)

	if (!conversation || conversation.userId !== userId) {
		return c.json<ApiResponse<never>>({ success: false, error: 'Not found' } as ApiResponse<never>, 404)
	}

	const msgs = await db
		.select()
		.from(messages)
		.where(eq(messages.conversationId, id))
		.orderBy(messages.createdAt)

	return c.json<ApiResponse<{ conversation: Conversation; messages: Message[] }>>({
		success: true,
		data: { conversation, messages: msgs as Message[] },
	})
})

app.delete('/:id', async (c) => {
	const { userId } = getAuth(c)
	if (!userId) return c.json<ApiResponse<never>>({ success: false, error: 'Unauthorized' } as ApiResponse<never>, 401)

	const db = getDb()
	const id = c.req.param('id')

	const [conversation] = await db
		.select()
		.from(conversations)
		.where(eq(conversations.id, id))
		.limit(1)

	if (!conversation || conversation.userId !== userId) {
		return c.json<ApiResponse<never>>({ success: false, error: 'Not found' } as ApiResponse<never>, 404)
	}

	await db.delete(conversations).where(eq(conversations.id, id))

	return c.json<ApiResponse<{ success: boolean }>>({ success: true, data: { success: true } })
})

export default app
