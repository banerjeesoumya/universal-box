import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { userRouter } from './routes/user'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.use("/*", cors())

app.route('/api/v1/user', userRouter)

export default app
