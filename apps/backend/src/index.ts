import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import type { ApiResponse } from '@openbot/shared'
import { logger } from '@openbot/shared'

export const config = {
  runtime: 'edge',
}

const app = new Hono().basePath('/api')

app.get('/', (c) => {
  return c.json<ApiResponse<{ message: string }>>({
    success: true,
    data: { message: 'OpenBot API' },
  })
})

app.get('/health', (c) => {
  return c.json({ status: 'ok' })
})

export default handle(app)

if (process.env.NODE_ENV !== 'production') {
  const { serve } = await import('@hono/node-server')
  const port = Number(process.env.PORT) || 3000
  serve({ fetch: app.fetch, port }, (info) => {
    logger.success(`Server running on http://localhost:${info.port}`)
  })
}
