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