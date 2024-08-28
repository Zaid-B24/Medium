import { Hono } from 'hono'
import { userRouter } from './Routes/user';
import { blogRouter } from './Routes/blog';
import { cors } from 'hono/cors'


const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string
	}
}>();

app.use('/api/*', cors())
app.route('/api/v1/user', userRouter);
app.route('/api/v1/blog', blogRouter);
app.get('/', (c) => {
	return c.json({ message: "Welcome to my server" });
  });


export default app
