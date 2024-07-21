// eslint-disable-next-line no-redeclare
import { NextFunction, Request, Response } from 'express';

import { plainToInstance } from 'class-transformer';
import { validate as validator } from 'class-validator';

export const validate = async (
  schema: new () => {},
  requestObject: object
) => {
  const transformedClass: any = plainToInstance(schema, requestObject);
  const errors = await validator(transformedClass);
  if (errors.length > 0) {
    return errors;
  }
  return true;
};

export const validateRequest =
  (validationSchema: any, path: 'params' | 'body' | 'query' | 'headers') =>
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await validate(validationSchema, {
      ...req[path],
    });

    if (result !== true) {
      return res.status(400).json({
        success: false,
        validation_path: path,
        errors: [...result],
      });
    }

    next();

    return true;
  };
