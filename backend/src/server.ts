import 'dotenv/config';
import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';

import { routes } from './routes';
import AppError from './errors/AppError';

import '../src/typeorm';

const app = express();

app.use(express.json());
app.use(routes);

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  console.error(err);
  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  });
});

app.listen(
  process.env.API_PORT || 3333,
  () => console.log(`listening on port ${process.env.API_PORT || 3333}`)
);
