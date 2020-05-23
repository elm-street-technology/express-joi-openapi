interface IContactObject {
  name?: string;
  url?: string;
  email?: string;
}

export interface IPathItemObject {
  summary?: string;
  description?: string;
  get?: IOperationObject;
  put?: IOperationObject;
  post?: IOperationObject;
  delete?: IOperationObject;
  options?: IOperationObject;
  head?: IOperationObject;
  patch?: IOperationObject;
  trace?: IOperationObject;
  servers?: Array<IServerObject>;
  parameters?: Array<IParameterObject>;
}

export interface IParameterObject {
  name: string;
  in: string;
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  // TODO style
  // TODO explode
  // TODO allowReserved
  schema?: ISchemaObject | IReferenceObject;
  // TODO example
  // TODO examples
  // TODO content
}

export interface IComponentsObject {
  schemas?: { [name: string]: ISchemaObject };
  securitySchemas?: { [name: string]: ISchemaObject };
  // TODO responses
  // TODO parameters
  // TODO examples
  // TODO requestBodies
  // TODO headers
  // TODO links
  // TODO callbacks
}

interface ILicenseObject {
  name: string;
  url?: string;
}

export interface IExternalDocs {
  description?: string;
  url: string;
}

export interface ITagObject {
  name: string;
  description?: string;
  externalDocs?: IExternalDocs;
}

export interface IInfoObject {
  title: string;
  description?: string;
  termsOfService?: string;
  contact?: IContactObject;
  license?: ILicenseObject;
  version: string;
}

interface IServerVariableObject {
  [ServerVriableName: string]: {
    enums?: Array<string>;
    default: string;
    description?: string;
  };
}

export interface IServerObject {
  url: string;
  description?: string;
  variables?: IServerVariableObject;
}

export interface ISecurityRequirementObject {
  [name: string]: Array<string>;
}

export interface IRequestBodyObject {
  description?: string;
  content: { [name: string]: IMediaTypeObject };
  required?: boolean;
}

export interface IOpenapiObject {
  openapi: string;
  info: IInfoObject;
  servers?: Array<IServerObject>;
  tags?: Array<ITagObject>;
  externalDocs?: IExternalDocs;
  components?: IComponentsObject;
  security?: Array<ISecurityRequirementObject>;
}

export type Type = 'string' | 'integer' | 'number' | 'boolean' | 'array' | 'object';

interface IReferenceObject {
  $ref: string;
}

// TODO divide into different types with unions
export interface ISchemaObject {
  type: Type;
  // TODO allOf
  // TODO oneOf
  // TODO anyOf
  // TODO not
  // TODO items
  // TODO additionalProperties
  description?: string;
  format?: string;
  default?: Type;
  properties?: { [name: string]: ISchemaObject | IReferenceObject };
  maxLength?: number;
  minLength?: number;
  exclusiveMinimum?: boolean;
  exclusiveMaximum?: boolean;
  minimum?: number;
  maximum?: number;
  items?: ISchemaObject;
  required?: string[];
  enum?: string[];
}

interface IExampleObject {
  summary?: string;
  description?: string;
  value?: Type;
  externalValue?: string;
}

export interface IOperationObject {
  tags?: Array<ITagObject>;
  summary?: string;
  description?: string;
  // TODO externalDocs
  operationId?: string;
  // TODO parameters
  // TODO request body (defaults)
  responses?: { [statusCode: string]: IResponseObject };
  // TODO callbacks
  deprecated?: boolean;
  // TODO security
  // TODO servers
}

interface IHeaderObject {
  description: string;
  schema?: ISchemaObject;
}

type Headers = { [name: string]: IHeaderObject };

interface IEncodingObject {
  contentType: string;
  headers?: Headers;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
}

export interface IMediaTypeObject {
  schema?: ISchemaObject | IReferenceObject;
  example?: Type;
  examples?: { [name: string]: IExampleObject };
  encoding?: { [type: string]: IEncodingObject };
}

interface ILinkObject {
  operationRef?: string;
  operationId?: string;
  parameters?: { [name: string]: Type };
  requestBody?: Type;
  description?: string;
  server?: IServerObject;
}

export interface IResponseObject {
  description: string;
  headers?: Headers;
  content?: { [type: string]: IMediaTypeObject };
  links?: { [name: string]: ILinkObject };
}
