import joi from '@hapi/joi';

export interface IJoiKey {
  key: string;
  schema: joi.ObjectSchema;
}

export default {
  // Helper function for getting the name of a Joi key object
  name(key: IJoiKey): string {
    return key.key;
  },

  // Return the key's schema
  schema(key: IJoiKey): joi.ObjectSchema {
    return key.schema;
  },
};
