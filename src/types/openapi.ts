interface IContactObject {
  name?: string;
  url?: string;
  email?: string;
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

export interface IComponentsObject {}

export interface ISecurityRequirementObject {
  [name: string]: Array<string>;
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

type Type = 'string' | 'integer' | 'number' | 'boolean' | 'array' | 'object';

interface ISchemaObject {
  type: Type;
}

interface IExampleObject {
  summary?: string;
  description?: string;
  value?: Type;
  externalValue?: string;
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

interface IMediaTypeObject {
  schema?: ISchemaObject;
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
