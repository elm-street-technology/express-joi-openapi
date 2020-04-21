import * as openapi from './types/openapi';
import * as express from 'express';
import * as joi from '@hapi/joi';
import * as pathToRegexp from 'path-to-regexp';
import _ from 'lodash';
import ParameterParser, { IPropertyObject } from './utils/parse-parameters';

export interface IPathConfig {
  method: 'get' | 'post' | 'put' | 'delete';
  path: string;
  description?: string;
  summary?: string;
  operationId?: string;
  // TODO externalDocs
  // TODO callbacks
  // TODO requestBody
  deprecated?: boolean;
  handler: Array<express.RequestHandler> | express.RequestHandler;
  tags?: Array<openapi.ITagObject>;
  responses?: { [statusCode: string]: openapi.IResponseObject };
  validate?: {
    query?: joi.ObjectSchema;
    params?: joi.ObjectSchema;
    body?: joi.ObjectSchema;
  };
}

export interface IPathObject {
  description?: string;
  parameters?: Array<IPropertyObject[]>;
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

  getPathObject(): IPathObject {
    const pathParams = this.pathParams ? this.pathParams.getParameters() : null;
    const queryParams = this.queryParams ? this.queryParams.getParameters() : null;
    const parameters = _.compact(_.concat([], pathParams, queryParams));
    return _.omitBy(
      {
        summary: this.config.summary,
        operationId: this.config.operationId,
        deprecated: this.config.deprecated,
        description: this.config.description,
        parameters,
        responses: this.config.responses,
        tags: this.config.tags,
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
    // TODO body
    // TODO header
    // TODO cookies
  }
}
