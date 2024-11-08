import express, { json } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectToDatabase from './db/mongoDB.js';
import { errorHandler } from './utils/errorHandler.js';
import usersRouter from './routes/usersRoutes.js';

config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(json());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(cookieParser());

app.use('/api/v1/users', usersRouter);

app.get('/', (req, res) => res.json({ message: 'Server is running!' }));
app.get('*', (req, res) => res.status(404).json({ message: 'Page not found!' }));

app.use(errorHandler);

connectToDatabase().then(() =>
  app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))
);
