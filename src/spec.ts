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

  constructor(baseSpec: IOpenapiBase) {
    this.baseSpec = baseSpec;
  }

  addPath(path: Path) {
    this.paths.push(path);
  }

  generatePaths() {
    const pathGroups: { [name: string]: Array<Path> } = _.groupBy(this.paths, p => p.getOpenapiPath());
    return _.transform(
      pathGroups,
      (pathsObjects: { [path: string]: any }, group: Array<Path>, key: string) => {
        pathsObjects[key] = _.transform(
          group,
          (pathObject: { [method: string]: any }, path) => {
            pathObject[path.getMethod()] = path.getPathObject();
          },
          {},
        );
      },
      {},
    );
  }

  getDefinition() {
    return { ...this.baseSpec, paths: this.generatePaths() };
  }
}
