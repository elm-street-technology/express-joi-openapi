import joi from '@hapi/joi';
import _ from 'lodash';

export function number(schema: any) {
  //: joi.ObjectSchema
  const jsonSchema: any = {
    type: 'number',
  };
  //console.log(schema);
  let rules = ['integer', 'less', 'greater', 'min', 'max', 'precision'];
  rules.forEach(value => {
    const rule = schema.$_getRule(value);
    //console.dir(rule);
    if (!rule) {
      return;
    }
    switch (rule.name) {
      case 'integer':
        jsonSchema.type = 'integer';
        break;
      case 'less':
        jsonSchema.exclusiveMaximum = true;
        jsonSchema.maximum = rule.args.limit;
        break;
      case 'greater':
        jsonSchema.exclusiveMinimum = true;
        jsonSchema.minimum = rule.args.limit;
        break;
      case 'min':
        jsonSchema.minimum = rule.args.limit;
        break;
      case 'max':
        jsonSchema.maximum = rule.args.limit;
        break;
      case 'precision':
        let multipleOf;
        if (rule.args > 1) {
          multipleOf = JSON.parse('0.' + '0'.repeat(rule.args - 1) + '1');
        } else {
          multipleOf = 1;
        }
        jsonSchema.multipleOf = multipleOf;
        break;
    }
  });
  return jsonSchema;
}

export function boolean(schema: any) {
  const jsonSchema: any = {
    type: 'boolean',
  };
  return jsonSchema;
}

export function date(schema: any) {
  const jsonSchema: any = {
    type: 'string',
    format: 'date-time',
  };

  if (!_.isEmpty(schema._flags)) {
    jsonSchema.type = 'integer';
    return jsonSchema;
  }

  // schema.type = 'string';
  // schema.format = 'date-time';
  return jsonSchema;
}

export function string(schema: any) {
  const jsonSchema: any = {
    type: 'string',
  };
  let rules = ['email', 'creditCard', 'regex', 'token', 'alphanum', 'ip', 'uri', 'guid'];
  rules.forEach(value => {
    const rule = schema.$_getRule(value);
    if (!rule) {
      return;
    }
    switch (rule.name) {
      case 'email':
        jsonSchema.format = 'email';
        break;
      case 'creditCard':
        jsonSchema.type = 'integer';
        jsonSchema.format = 'creditCard';
    }
  });
  return jsonSchema;
}
