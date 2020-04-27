import * as openapi from './types/openapi';
import * as express from 'express';
import * as joi from '@hapi/joi';
import * as pathToRegexp from 'path-to-regexp';
import _ from 'lodash';
import JoiSchema from './joi-schema';
import JoiKey from './joi-key';

export interface IPathConfig {
  method: 'get' | 'post' | 'put' | 'delete';
  path: string;
  description?: string;
  summary?: string;
  operationId?: string;
  // TODO externalDocs
  // TODO callbacks
  requestBody?: openapi.IRequestBodyObject;
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

export default class Path {
  private config: IPathConfig;
  private queryParams: Array<openapi.IParameterObject> | null = null;
  private pathParams: Array<openapi.IParameterObject> | null = null;
  private requestBody: openapi.IRequestBodyObject | null = null;

  constructor(config: IPathConfig) {
    this.config = config;
  }

  // Generate OpenAPI V3 Path Item Objects from a collection of paths
  static generatePaths(paths: Array<Path>): openapi.IPathItemObject {
    const pathGroups: { [name: string]: Array<Path> } = _.groupBy(paths, p => p.getOpenapiPath());
    return _.transform(
      pathGroups,
      (pathsObjects: { [path: string]: any }, group: Array<Path>, key: string) => {
        pathsObjects[key] = _.transform(
          group,
          (pathObject: { [method: string]: any }, path) => {
            pathObject[path.getMethod()] = path.getOperationObject();
          },
          {},
        );
      },
      {},
    );
  }

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

  getOperationObject(): openapi.IOperationObject {
    if (!this.pathParams && this.config.validate && this.config.validate.params) {
      this.pathParams = _.transform(
        JoiSchema.keys(this.config.validate.params),
        (acc, key) => {
          acc.push({
            name: JoiKey.name(key),
            in: 'path',
            schema: JoiSchema.openApiSchemaObject(JoiKey.schema(key)),
          });
        },
        [],
      );
    }
    if (!this.queryParams && this.config.validate && this.config.validate.query) {
      this.queryParams = _.transform(
        JoiSchema.keys(this.config.validate.query),
        (acc, key) => {
          acc.push({
            name: JoiKey.name(key),
            in: 'query',
            schema: JoiSchema.openApiSchemaObject(JoiKey.schema(key)),
          });
        },
        [],
      );
    }
    if (!this.requestBody && this.config.validate && this.config.validate.body) {
      this.requestBody = _.assign({}, this.config.requestBody || {}, {
        content: {
          // TODO multi request content type support
          '*/*': {
            schema: JoiSchema.openApiSchemaObject(this.config.validate.body),
          },
        },
      });
    }
    // TODO header
    // TODO cookies
    const parameters = _.compact(_.concat([], this.pathParams, this.queryParams));
    return _.omitBy(
      {
        summary: this.config.summary,
        operationId: this.config.operationId,
        deprecated: this.config.deprecated,
        description: this.config.description,
        parameters,
        responses: this.config.responses,
        requestBody: this.requestBody,
        tags: this.config.tags,
      },
      _.isNil,
    );
  }
}
