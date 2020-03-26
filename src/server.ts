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

  private generateValidator(route: IPathConfig) {
    return route.validate ? joiValidatorMiddleware(route.validate) : null;
  }

  private attachToServer(route: IPathConfig) {
    if (this.expressServer) {
      const handler = _.compact(_.concat([], this.generateValidator(route), route.handler));
      this.expressServer[route.method].apply(this.expressServer, [route.path, ...handler]);
    }
  }

  route(config: IPathConfig) {
    const path = new Path(config);
    this.spec.addPath(path);
    this.attachToServer(config);
  }
}
