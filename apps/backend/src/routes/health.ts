import { Hono } from 'hono'
import type { ApiResponse } from '@openbot/shared'

const app = new Hono()

app.get('/', (c) => {
	return c.json<ApiResponse<{ message: string }>>({
		success: true,
		data: { message: 'OpenBot API' },
	})
})

app.get('/health', (c) => {
	return c.json<ApiResponse<{ status: string }>>({ success: true, data: { status: 'ok' } })
})

export default app
