import joi from '@hapi/joi';

export function number(schema: any) {
  //: joi.ObjectSchema
  const jsonSchema: any = {
    type: 'number',
  };

  let rules = ['integer', 'less', 'greater', 'min', 'max', 'precision'];
  rules.forEach(value => {
    const rule = schema.$_getRule(value);
    console.dir(rule);
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
