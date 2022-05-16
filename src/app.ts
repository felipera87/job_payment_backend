import express, { Request, Response, NextFunction } from 'express';

import bodyParser from 'body-parser';

import { errors } from 'celebrate';

import 'express-async-errors';

import AppError from 'errors/AppError';
import routes from 'routes';

import sequelize from './models';
import './models/associations';

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);

app.use(routes);

app.use(errors());

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      validationErrors:
        Object.keys(err.validationErrors).length > 0
          ? err.validationErrors
          : undefined,
    });
  }

  // eslint-disable-next-line no-console
  console.error(err);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error.',
  });
});

export default app;
