const path = require('path');
const fastGlob = require('fast-glob');
const { Router } = require('express');

// Pull the list of HTTP methods from NodeJS
// similarly to what express does
const http = require('http');
const HTTP_METHODS = http.METHODS.map(m => m.toLowerCase());

module.exports = function(root, { cwd = process.cwd() } = {}) {
  root = path.resolve(cwd, root);

  const router = Router();

  // First let's list the routes file
  const routes = fastGlob.sync('**/routes.js', { cwd: root });
  routes.forEach(route => {
    // Grab the configuration, using the full path as we don't
    // know where we are relative to this file
    const fullPath = path.resolve(root, route);
    const config = require(fullPath);

    // Create a new router specific to this route
    // configure it and set it up
    const subRouter = new Router();
    applyConfiguration(subRouter, config);
    router.use('/' + path.dirname(route), subRouter);
  });

  const methodFiles = fastGlob.sync(
    `**/{*.,}(${HTTP_METHODS.join('|')}).(js|njk)`,
    {
      cwd: root
    }
  );
  methodFiles.forEach(file => {
    const fullPath = path.resolve(root, file);
    const { routePath, method, extension } = pathForFile(file);

    const handler = getHandler(fullPath, extension);
    // Ending `$` ensure we match exact paths and we don't handle paths
    // that have not been defined
    router[method]('/' + toExpressPath(routePath), handler);
  });

  return router;
};

function toExpressPath(routePath) {
  return routePath.replace(/\$/g, ':').replace(/__/g, '/');
}

function getHandler(filePath, extension) {
  if (extension == 'js') {
    return require(filePath);
  } else {
    return function(req, res) {
      res.render(filePath, { req, res });
    };
  }
}

function pathForFile(filePath) {
  const r = new RegExp(`(.*)[/.](${HTTP_METHODS.join('|')}).(.*?)$`);
  const [
    ,
    // ^ ignore first param
    routePath,
    method,
    extension
  ] = r.exec(filePath);
  return { routePath, method, extension };
}

function applyConfiguration(router, config) {
  if (Array.isArray(config)) {
    router.use(...config);
  } else if (typeof config == 'object') {
    applyConfigurationObject(router, config);
  } else {
    config(router);
  }
}

function applyConfigurationObject(router, config) {
  if (config.use) {
    applyMiddlewareConfiguration(router, config.use);
  }
  HTTP_METHODS.forEach(method => {
    if (config[method]) {
      router[method]('/', config[method]);
    }
  });
}

function applyMiddlewareConfiguration(router, config) {
  if (Array.isArray(config)) {
    router.use(...config);
  } else {
    router.use(config);
  }
}
