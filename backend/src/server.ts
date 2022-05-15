import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';

import '../src/typeorm';

const app = express();

app.listen(
  process.env.API_PORT || 3333,
  () => console.log('Server started on port 3333')
);
