import * as express from 'express';
import * as joi from '@hapi/joi';
import * as pathToRegexp from 'path-to-regexp';
import _ from 'lodash';
import ParameterParser from './utils/parse-parameters';

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
  private queryParams: ParameterParser | null = null;
  private pathParams: ParameterParser | null = null;

  getOpenapiPath() {
    const parsedPath = pathToRegexp.parse(this.config.path);
    return _.reduce(
      parsedPath,
      (out, item) => {
        if (_.isString(item)) {
          out += item;
        } else {
          out += `${item.prefix}{${item.name}}${item.suffix}`;
        }
        return out;
      },
      '',
    );
  }

  getMethod(): string {
    return this.config.method;
  }

  getPathObject() {
    const pathParams = this.pathParams ? this.pathParams.getParameters() : null;
    const queryParams = this.queryParams ? this.queryParams.getParameters() : null;
    const parameters = _.compact(_.concat([], pathParams, queryParams));
    return _.omitBy(
      {
        description: this.config.description,
        parameters,
      },
      _.isNil,
    );
  }

  constructor(config: IPathConfig) {
    this.config = config;
    if (this.config.validate && this.config.validate.query) {
      this.queryParams = new ParameterParser(this.config.validate.query, 'query');
    }
    if (this.config.validate && this.config.validate.params) {
      this.pathParams = new ParameterParser(this.config.validate.params, 'path');
    }
  }
}
