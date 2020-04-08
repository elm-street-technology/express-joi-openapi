import _ from 'lodash';
import path from 'path';
import express from 'express';
import glob from 'glob';
import SwaggerUI from 'swagger-ui-express';
// import webpack from 'webpack';
// import webpackDevMiddleware from 'webpack-dev-middleware';
// import webpackHotMiddleware from 'webpack-hot-middleware';

//import config from '../webpack.server.config.js';
import * as Openapi from './openapi';
const server = {
  app: express(),
};
const DIST_DIR = __dirname;
const HTML_FILE = path.join(DIST_DIR, 'index.html');
//const compiler = webpack(config);
const port = 3000;

// server.app.use(
//   webpackDevMiddleware(compiler, {
//     publicPath: config.output.publicPath,
//   }),
// );
// server.app.use(webpackHotMiddleware(compiler));

Openapi.setup(server);

server.app.get('/', (req, res) => res.send('Hello World!'));
server.app.use(
  '/docs',
  SwaggerUI.serve,
  SwaggerUI.setup(null, {
    explorer: true,
    swaggerOptions: {
      urls: [
        {
          url: '/v1/openapi.json',
          name: 'V1 Openapi Spec',
        },
      ],
    },
  }),
);

glob(path.join(DIST_DIR, '{controllers,api/controllers}/**/*.js'), (err, files) => {
  _.each(files, file => {
    // this can be removed once everything is converted to exporting routes
    // $FlowIgnore
    const controller = require(file); // eslint-disable-line
    if (_.isFunction(controller.routes)) {
      controller.routes(server);
    }
  });
});

server.app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
