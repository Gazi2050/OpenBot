import './load-env.js'
import { Hono } from 'hono'
import { clerkMiddleware } from '@clerk/hono'
import { logger } from '@openbot/shared'
import { initDb } from './db/index.js'
import { errorHandler } from './middleware/error-handler.js'
import routes from './routes/index.js'

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not set')
}
initDb(process.env.DATABASE_URL)

const app = new Hono().basePath('/api')

app.use('*', clerkMiddleware())
app.onError(errorHandler)
app.route('/', routes)

export default app

if (!process.env.VERCEL) {
	const { serve } = await import('@hono/node-server')
	const port = Number(process.env.PORT) || 3000
	serve({ fetch: app.fetch, port }, (info) => {
		logger.success(`Server running on http://localhost:${info.port}`)
	})
}
