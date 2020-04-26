import * as openapi from './types/openapi';
import _ from 'lodash';

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
  private components: openapi.IComponentsObject = {};

  constructor(baseSpec: IOpenapiBase) {
    this.baseSpec = baseSpec;
  }

  addPath(path: Path) {
    this.paths.push(path);
  }

  addComponent(component: openapi.IComponentsObject) {
    Object.keys(component).forEach((key: keyof openapi.IComponentsObject) => {
      if (!this.components[key]) {
        this.components[key] = {};
      }
      this.components[key] = Object.assign({}, this.components[key], component[key]);
    });
  }

  getDefinition() {
    return { ...this.baseSpec, paths: Path.generatePaths(this.paths), components: this.components };
  }
}
