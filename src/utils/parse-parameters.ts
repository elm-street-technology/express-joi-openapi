import joi from '@hapi/joi';
import _ from 'lodash';
import * as Schema from './schema';
// import convert from 'joi-to-json-schema';

interface ISchemaObject {}

interface IPropertyObject {
  name: string;
  in: string;
  description?: string;
  example?: any;
  required?: boolean;
  allowEmptyValue?: boolean; // only for query type
  schema: ISchemaObject;
}

interface JoiKeysObject {
  key: string;
  schema: joi.ObjectSchema;
}

export default class Parameters {
  private parameters: IPropertyObject[] = [];
  private type: string;

  constructor(joiSchema: joi.ObjectSchema, type: 'query' | 'header' | 'path' | 'cookie') {
    this.type = type;
    if (!joi.isSchema(joiSchema) && joiSchema.type !== 'object') {
      throw new Error(`${type} must be a valid joi object schema`);
    }
    this.convert(joiSchema);
  }

  convert(schema: joi.ObjectSchema) {
    this.parameters = _.transform<JoiKeysObject, IPropertyObject>(
      schema.$_terms.keys,
      (out, property) => {
        const prop: IPropertyObject = {
          name: property.key,
          in: this.type,
          schema: this.generateSchema(property),
        };
        if (property.schema._flags.description) {
          prop.description = property.schema._flags.description;
        }
        if (property.schema._flags.presence === 'required') {
          prop.required = true;
        }
        if (property.schema.$_terms.examples) {
          prop.example = _.first(property.schema.$_terms.examples);
        }
        out.push(prop);
      },
      [],
    );
    console.log(JSON.stringify(this.parameters, null, 2));
  }

  generateSchema(property: JoiKeysObject): ISchemaObject {
    switch (property.schema.type) {
      case 'number':
        return Schema.number(property.schema);
    }
  }

  getParameters() {
    return this.parameters;
  }
}
