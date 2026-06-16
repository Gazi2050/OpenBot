import { Hono } from 'hono'
import health from './health.js'
import me from './me.js'
import ai from './ai.js'

const app = new Hono()

app.route('/', health)
app.route('/', me)
app.route('/ai', ai)

export default app
