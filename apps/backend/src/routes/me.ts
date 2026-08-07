import { Hono } from 'hono'
import { getAuth } from '@clerk/hono'
import type { ApiResponse } from '@openbot/shared'

const app = new Hono()

app.get('/me', (c) => {
	const { userId } = getAuth(c)
	if (!userId) return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
	return c.json<ApiResponse<{ userId: string }>>({ success: true, data: { userId } })
})

export default app
