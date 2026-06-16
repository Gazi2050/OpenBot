import './load-env.js'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { clerkMiddleware } from '@clerk/hono'
import { logger } from '@openbot/shared'
import { initDb } from './db/index.js'
import routes from './routes/index.js'

export const config = {
	runtime: 'edge',
}

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not set')
}
initDb(process.env.DATABASE_URL)

const app = new Hono().basePath('/api')

app.use('*', clerkMiddleware())
app.route('/', routes)

export default handle(app)

if (process.env.NODE_ENV !== 'production') {
	const { serve } = await import('@hono/node-server')
	const port = Number(process.env.PORT) || 3000
	serve({ fetch: app.fetch, port }, (info) => {
		logger.success(`Server running on http://localhost:${info.port}`)
	})
}
