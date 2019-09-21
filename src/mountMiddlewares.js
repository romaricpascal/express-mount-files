const fastGlob = require('fast-glob');
const path = require('path');
const { Router } = require('express');
const HTTP_METHODS = require('./HTTP_METHODS');
const toExpressPath = require('./toExpressPath');
const compareRouteDepth = require('./compareRouteDepth');
const compareRouteVariability = require('./compareRouteVariability');

module.exports = function mountMiddlewares(router, root) {
  // Extra routes to configure
  const routesFromMiddlewares = [];
  // First let's list the routes file
  fastGlob
    .sync('**/routes.js', { cwd: root })
    .map(filePath => {
      const fullPath = path.resolve(root, filePath);
      const config = require(fullPath);

      return {
        // We need the express routePath here so that
        // variables are properly detected when sorting
        routePath: toExpressPath(path.dirname(filePath)),
        config
      };
    })
    .sort(({ routePath: routePathA }, { routePath: routePathB }) => {
      return (
        compareRouteDepth(routePathA, routePathB) ||
        compareRouteVariability(routePathA, routePathB)
      );
    })
    .forEach(({ routePath, config }) => {
      // Create a new router specific to this route
      // configure it and set it up
      const subRouter = new Router();
      applyConfiguration(subRouter, config);
      // Store potential routes for registering later on
      if (typeof config == 'object' && !Array.isArray(config)) {
        routesFromMiddlewares.push(...getRoutes(config, routePath));
      }
      // Register the router with the base router
      router.use('/' + routePath, subRouter);
    });
  return routesFromMiddlewares;
};

function applyConfiguration(router, config) {
  if (Array.isArray(config)) {
    router.use(...config);
  } else if (typeof config == 'function') {
    config(router);
  } else {
    if (config.use) {
      router.use(config.use);
    }
  }
}

function getRoutes(config, routePath) {
  const routes = [];
  HTTP_METHODS.forEach(method => {
    if (config[method]) {
      routes.push({
        routePath,
        method,
        extension: 'js',
        handler: config[method]
      });
    }
  });
  return routes;
}
