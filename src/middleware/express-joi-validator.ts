import _ from 'lodash';
import Joi from '@hapi/joi';
import * as express from 'express';

export default function expressJoiMiddleware(schema: { query?: Object; params?: Object; body?: Object }) {
  return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    try {
      if (schema.query) {
        req.query = Joi.attempt(req.query, schema.query);
      }
      if (schema.params) {
        req.params = Joi.attempt(req.params, schema.params);
      }
      if (schema.body) {
        req.body = Joi.attempt(req.body, schema.body);
      }
      next();
    } catch (error) {
      if (error.isJoi) {
        res.status(400).json({
          error: 'ValidationError',
          messages: _.map(error.details, errMessage => ({
            message: errMessage.message,
            path: errMessage.path,
          })),
        });
      } else {
        next(error);
      }
    }
  };
}
