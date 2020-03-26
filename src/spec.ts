import * as openapi from './types/openapi';

import Path from './path';

export interface IOpenapiBase {
  openapi: string;
  info: openapi.IInfoObject;
  servers?: Array<openapi.IServerObject>;
  tags?: Array<openapi.ITagObject>;
  externalDocs?: openapi.IExternalDocs;
  security?: Array<openapi.ISecurityRequirementObject>;
}

export default class Spec {
  public paths: Array<Path> = [];
  public baseSpec: IOpenapiBase;

  constructor(baseSpec: IOpenapiBase) {
    this.baseSpec = baseSpec;
  }

  addPath(path: Path) {
    this.paths.push(path);
  }

  generatePaths() {
    return {};
  }

  getDefinition() {
    return { ...this.baseSpec, paths: this.generatePaths() };
  }
}
