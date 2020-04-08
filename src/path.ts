import * as openapi from './types/openapi';
import * as express from 'express';
import * as joi from '@hapi/joi';
import * as pathToRegexp from 'path-to-regexp';
import _ from 'lodash';
import ParameterParser, { IPropertyObject } from './utils/parse-parameters';
import { IOpenapiBase } from './spec';

export interface IPathConfig {
  method: 'get' | 'post' | 'put' | 'delete';
  path: string;
  summary: string;
  description: string;
  operationId: string;
  deprecated: boolean;
  tags?: Array<openapi.ITagObject>;
  handler: Array<express.RequestHandler> | express.RequestHandler;
  responses: { [statusCode: string]: openapi.IResponseObject };
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
  private parentConfig: IOpenapiBase;
  private config: IPathConfig;
  private queryParams: ParameterParser | null = null;
  private pathParams: ParameterParser | null = null;

  getOpenapiPath() {
    //console.log('this.config ==>', this.config);
    const parsedPath = pathToRegexp.parse(this.config.path);
    //console.log('parsedPath ==>', parsedPath);
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
    const response500 = !_.has(this.config.responses, '500') ? { '500': this.parentConfig.defaultErrorResponse } : {};

    return _.omitBy(
      {
        summary: this.config.summary,
        operationId: this.config.operationId,
        description: this.config.description,
        tags: this.config.tags,
        deprecated: !!this.config.deprecated,
        parameters,
        responses: _.assign({}, this.config.responses, response500),
      },
      _.isNil,
    );
  }

  constructor(config: IPathConfig, parentConfig: IOpenapiBase) {
    this.parentConfig = parentConfig;
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
