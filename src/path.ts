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
  validateQuery?: {
    componentName?: string;
    schema: joi.ObjectSchema;
  };
  validateParams?: {
    componentName?: string;
    schema: joi.ObjectSchema;
  };
  validateBody?: {
    componentName?: string;
    schema: joi.ObjectSchema;
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

  generateComponent(): openapi.IComponentsObject | null {
    if (this.config.validateBody && this.config.validateBody.componentName) {
      const schemas: { [name: string]: openapi.ISchemaObject } = {};
      const name = this.config.validateBody.componentName;
      schemas[name] = JoiSchema.openApiSchemaObject(this.config.validateBody.schema);
      return { schemas };
    } else {
      return null;
    }
  }

  getOperationObject(): openapi.IOperationObject {
    if (!this.pathParams && this.config.validateParams) {
      this.pathParams = _.transform(
        JoiSchema.keys(this.config.validateParams.schema),
        (acc, key) => {
          acc.push({
            name: JoiKey.name(key),
            required: true,
            in: 'path',
            schema: JoiSchema.openApiSchemaObject(JoiKey.schema(key)),
          });
        },
        [],
      );
    }
    if (!this.queryParams && this.config.validateQuery) {
      this.queryParams = _.transform(
        JoiSchema.keys(this.config.validateQuery.schema),
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
    if (!this.requestBody && this.config.validateBody) {
      let schemaObject;
      const componentName = this.config.validateBody.componentName;
      if (componentName) {
        // This schema has been added to the spec as a named
        // component.
        schemaObject = { $ref: `#/components/schemas/${componentName}` };
      } else {
        // This is an inline schema
        schemaObject = JoiSchema.openApiSchemaObject(this.config.validateBody.schema);
      }
      this.requestBody = _.assign({}, this.config.requestBody || {}, {
        content: {
          // TODO multi request content type support
          '*/*': {
            schema: schemaObject,
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
