import { Hono } from 'hono'
import { getAuth } from '@clerk/hono'

const app = new Hono()

app.get('/me', (c) => {
	const { userId } = getAuth(c)
	if (!userId) return c.json({ error: 'Unauthorized' }, 401)
	return c.json({ userId })
})

export default app
