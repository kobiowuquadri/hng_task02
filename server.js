import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import { authRoutes } from './src/routes/auth-routes.js';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { db } from './src/config/db.js';
import { sql } from 'drizzle-orm';
import { orgRoutes } from './src/routes/org-routes.js';
import { handleErrors } from './src/middlewares/errorHandler.js';

const app = express()


// helmet to secure app by setting http response headers
app.use(helmet())
app.use(morgan('tiny'))

let limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "We have received too many requests from this IP. Please try again after one hour."
})

// middlewares
app.use('/api', limiter)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// cors config
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000' ],
  optionsSuccessStatus: 200,
  credentiasl: true,
}

app.use(cors(corsOptions))

// routes
app.use('/auth', authRoutes)
app.use('/api', orgRoutes)

// home
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Backend Connected Successfully' });
})

// error handler
app.use(handleErrors)

// Connect to database
async function testDatabaseConnection() {
  try {
    const result = await db.execute(sql`SELECT NOW()`);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error.message)
  }
}

testDatabaseConnection();



export { app }

