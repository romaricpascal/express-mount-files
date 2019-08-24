const path = require('path');
const fastGlob = require('fast-glob');
const { Router } = require('express');

module.exports = function(root, { cwd = process.cwd() } = {}) {
  root = path.resolve(cwd, root);

  const router = new Router();

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
  ['get', 'post', 'put', 'delete'].forEach(method => {
    if (config[method]) {
      router[method]('/', config[method]);
    }
  });
}
