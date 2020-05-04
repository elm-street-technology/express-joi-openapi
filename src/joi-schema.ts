import joi from '@hapi/joi';
import _ from 'lodash';
import * as openapi from './types/openapi';
import JoiKey, { IJoiKey } from './joi-key';

export default {
  keys,
  openApiSchemaObject,
};

// Helper function to hide Joi's internal access of "key" objects
function keys(schema: joi.ObjectSchema): Array<IJoiKey> {
  return schema.$_terms.keys;
}

// Transform a Joi Schema to an OpenAPI V3 Schema Object
function openApiSchemaObject(schema: joi.ObjectSchema): openapi.ISchemaObject {
  switch (schema.type) {
    case 'number':
      return toSchemaNumber(schema);
    case 'string':
      return toSchemaString(schema);
    case 'object':
      return toSchemaObject(schema);
    case 'array':
      return toSchemaArray(schema);
    case 'boolean':
      return toSchemaBoolean(schema);
  }
}

// Transform a Joi schema to a number type OpenAPI V3 Schema Object
function toSchemaNumber(schema: joi.ObjectSchema): openapi.ISchemaObject {
  let openApiSchema: openapi.ISchemaObject = {
    type: <openapi.Type>'number',
  };
  let rules = ['integer', 'less', 'greater', 'min', 'max', 'precision'];
  rules.forEach(value => {
    const rule = schema.$_getRule(value);
    if (!rule) {
      return;
    }
    switch (rule.name) {
      case 'integer':
        openApiSchema.type = 'integer';
        break;
      case 'less':
        openApiSchema.exclusiveMaximum = true;
        openApiSchema.maximum = rule.args.limit;
        break;
      case 'greater':
        openApiSchema.exclusiveMinimum = true;
        openApiSchema.minimum = rule.args.limit;
        break;
      case 'min':
        openApiSchema.minimum = rule.args.limit;
        break;
      case 'max':
        openApiSchema.maximum = rule.args.limit;
        break;
    }
  });
  return openApiSchema;
}

// Transform a Joi schema to a string type OpenAPI V3 Schema Object
function toSchemaString(schema: joi.ObjectSchema): openapi.ISchemaObject {
  let openApiSchema: openapi.ISchemaObject = {
    type: <openapi.Type>'string',
  };
  let rules = ['min', 'max'];
  rules.forEach(value => {
    const rule = schema.$_getRule(value);
    if (!rule) {
      return;
    }
    switch (rule.name) {
      case 'min':
        openApiSchema.minLength = rule.args.limit;
        break;
      case 'max':
        openApiSchema.maxLength = rule.args.limit;
        break;
    }
  });
  return openApiSchema;
}

// Transform a Joi schema to a boolean type OpenAPI V3 Schema Object
function toSchemaBoolean(schema: joi.ObjectSchema): openapi.ISchemaObject {
  return {
    type: <openapi.Type>'boolean',
  };
}

// Transform a Joi schema to a object type OpenAPI V3 Schema Object
function toSchemaObject(schema: joi.ObjectSchema): openapi.ISchemaObject {
  return {
    type: <openapi.Type>'object',
    properties: _.transform(
      keys(schema),
      (acc: { [name: string]: openapi.ISchemaObject }, key: IJoiKey) => {
        acc[JoiKey.name(key)] = openApiSchemaObject(JoiKey.schema(key));
      },
      {},
    ),
  };
}

// Transform a Joi schema to a array type OpenAPI V3 Schema Object
function toSchemaArray(schema: joi.ObjectSchema): openapi.ISchemaObject {
  let openApiSchema: openapi.ISchemaObject = {
    type: <openapi.Type>'array',
  };
  let rules = ['items'];
  rules.forEach(value => {
    const rule = schema.$_getRule(value);
    if (!rule) {
      return;
    }
    switch (rule.name) {
      case 'items': {
        if (schema.$_terms.items.length === 1) {
          openApiSchema.items = openApiSchemaObject(schema.$_terms.items[0]);
        } else {
          throw new Error('Array items anyOf, oneOf, allOf not implemented.');
        }
      }
    }
  });
  return openApiSchema;
}
