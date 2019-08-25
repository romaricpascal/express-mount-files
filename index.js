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

  return router;
};

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
