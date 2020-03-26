import * as express from 'express';
import * as joi from '@hapi/joi';

export interface IPathConfig {
  method: 'get' | 'post' | 'put' | 'delete';
  path: string;
  description: string;
  handler: Array<express.RequestHandler> | express.RequestHandler;
  responses: {};
  // responses: {| [statusCode: string | "default"]: $OpenapiResponseObject |},
  validate?: {
    query?: joi.ObjectSchema;
    params?: joi.ObjectSchema;
    body?: joi.ObjectSchema;
  };
}

export default class Path {
  private config: IPathConfig;
  constructor(config: IPathConfig) {
    this.config = config;
  }
}
