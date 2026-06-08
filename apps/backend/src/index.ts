import 'dotenv/config'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import type { ApiResponse } from '@openbot/shared'
import { logger } from '@openbot/shared'
import aiRoutes from './routes/ai.js'

export const config = {
  runtime: 'edge',
}

const app = new Hono().basePath('/api')

app.use('*', clerkMiddleware())

app.get('/', (c) => {
  return c.json<ApiResponse<{ message: string }>>({
    success: true,
    data: { message: 'OpenBot API' },
  })
})

app.get('/health', (c) => {
  return c.json({ status: 'ok' })
})

app.get('/me', (c) => {
  const { userId } = getAuth(c)
  if (!userId) return c.json({ error: 'Unauthorized' }, 401)
  return c.json({ userId })
})

app.route('/ai', aiRoutes)

export default handle(app)

if (process.env.NODE_ENV !== 'production') {
  const { serve } = await import('@hono/node-server')
  const port = Number(process.env.PORT) || 3000
  serve({ fetch: app.fetch, port }, (info) => {
    logger.success(`Server running on http://localhost:${info.port}`)
  })
}
