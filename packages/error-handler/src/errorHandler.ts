// eslint-disable-next-line no-redeclare
import { NextFunction, Request, Response } from 'express';

import AppError from './AppError';
import logger from '@repo/logger';

const errorMiddleware = (
  err: AppError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  _next: NextFunction
) => {
  logger.error(err);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    status: 'error',
    message: 'Something went wrong!',
  });
};

export default errorMiddleware;
