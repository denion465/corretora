import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';

import { routes } from './routes';
import '../src/typeorm';

const app = express();

app.use(express.json());
app.use(routes);

app.listen(
  process.env.API_PORT || 3333,
  () => console.log('Server started on port 3333')
);
