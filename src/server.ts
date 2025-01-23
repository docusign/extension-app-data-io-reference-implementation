/**
 * Setup express server.
 */

import morgan from 'morgan';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';

import 'express-async-errors';

import BaseRouter from './controllers/api.controller';
import Paths from './constants/paths';

import env from './env';
import HttpStatusCodes from './constants/http';

import { NodeEnvs } from './constants/env';
import { RouteError } from './utils/errors';
import { UnauthorizedError } from 'express-jwt';
import path from 'path';

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/js', express.static(path.join(__dirname, '../public/js')));

// Show routes called in console during development
if (env.NODE_ENV === NodeEnvs.Dev) {
  app.use(morgan('dev'));
}

// Security
if (env.NODE_ENV === NodeEnvs.Production) {
  app.use(helmet());
}

// Add APIs, must be after middleware
app.use(Paths.Base, BaseRouter);

// Add error handler
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (env.NODE_ENV !== NodeEnvs.Test) {
    console.error(err, true);
  }
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError || err instanceof UnauthorizedError) {
    status = err.status;
  }
  return res.status(status).json({ error: err.message });
});

export default app;
