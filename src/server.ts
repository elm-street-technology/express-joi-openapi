import Spec, { IOpenapiBase } from './spec';
import Path, { IPathConfig } from './path';
import joiValidatorMiddleware from './middleware/express-joi-validator';
import _ from 'lodash';
import * as openapi from './types/openapi';

import * as express from 'express';

export default class Server {
  private expressServer?: express.Application;
  private spec: Spec;

  constructor(config: IOpenapiBase, expressServer?: express.Application) {
    this.expressServer = expressServer;
    this.spec = new Spec(config);
  }

  public getDefinition(): openapi.IOpenapiObject {
    return this.spec.getDefinition();
  }

  private generateValidator(route: IPathConfig): express.Handler | null {
    return route.validate ? joiValidatorMiddleware(route.validate) : null;
  }

  private attachToServer(route: IPathConfig) {
    if (!this.expressServer) {
      return;
    }
    const handlers: express.Handler[] = _.compact(_.concat([], this.generateValidator(route), route.handler));

    switch (route.method.toLowerCase()) {
      case 'get':
        return this.expressServer.get(route.path, ...handlers);
      case 'put':
        return this.expressServer.put(route.path, ...handlers);
      case 'post':
        return this.expressServer.post(route.path, ...handlers);
      case 'delete':
        return this.expressServer.delete(route.path, ...handlers);
      default:
        throw new Error('Unsupported Request Method');
    }
  }

  route(config: IPathConfig) {
    const path = new Path(config, this.spec.baseSpec);
    this.spec.addPath(path);
    this.attachToServer(config);
  }

  routes(configs: Array<IPathConfig>) {
    configs.forEach((config: IPathConfig) => {
      this.route(config);
    });
  }
}
