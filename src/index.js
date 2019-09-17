const path = require('path');
const fastGlob = require('fast-glob');
const { Router } = require('express');
const compareRouteDepth = require('./lib/compareRouteDepth');
const compareRouteVariability = require('./lib/compareRouteVariability');

// Pull the list of HTTP methods from NodeJS
// similarly to what express does
const http = require('http');
const HTTP_METHODS = http.METHODS.map(m => m.toLowerCase());

module.exports = function(root, { cwd = process.cwd() } = {}) {
  root = path.resolve(cwd, root);
  // The base router that'll hold everything
  const router = Router();

  // An array collecting the extra routes to be set up
  const methodHandlers = [];

  // First let's list the routes file
  const routes = fastGlob
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
    });

  routes.forEach(({ routePath, config }) => {
    // Create a new router specific to this route
    // configure it and set it up
    const subRouter = new Router();
    applyConfiguration(subRouter, config);
    // Store potential routes for registering later on
    if (typeof config == 'object' && !Array.isArray(config)) {
      methodHandlers.push(...getMethodHandlers(config, routePath));
    }

    // Register the router with the base router
    router.use('/' + routePath, subRouter);
  });

  const methodFiles = fastGlob
    .sync(`**/{*.,}(${HTTP_METHODS.join('|')}).(js|njk)`, {
      cwd: root
    })
    .map(filePath => {
      const fullPath = path.resolve(root, filePath);
      const { routePath, method, extension } = pathForFile(filePath);

      const handler = getHandler(fullPath, extension);
      return {
        fullPath,
        routePath: toExpressPath(routePath),
        method,
        extension,
        handler
      };
    })
    .concat(methodHandlers)
    .sort((routeA, routeB) => {
      return (
        -1 * compareRouteDepth(routeA.routePath, routeB.routePath) ||
        compareRouteVariability(routeA.routePath, routeB.routePath) ||
        compareMethod(routeA.method, routeB.method) ||
        compareExtension(routeA.extension, routeB.extension)
      );
    });
  methodFiles.forEach(({ method, routePath, handler }) => {
    router[method]('/' + routePath, handler);
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
  // Ending `$` ensure we match exact paths and we don't handle paths
  // that have not been defined
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
  } else if (typeof config == 'function') {
    config(router);
  } else {
    if (config.use) {
      router.use(config.use);
    }
  }
}

function getMethodHandlers(config, routePath) {
  const methodHandlers = [];
  HTTP_METHODS.forEach(method => {
    if (config[method]) {
      methodHandlers.push({
        routePath,
        method,
        extension: 'js',
        handler: config[method]
      });
    }
  });
  return methodHandlers;
}

function compareExtension(extensionA, extensionB) {
  if (extensionA == 'js') {
    return -1;
  } else if (extensionB == 'js') {
    return 1;
  } else {
    return 0;
  }
}

function compareMethod(methodA, methodB) {
  if (methodA == 'get') {
    return -1;
  } else if (methodB == 'get') {
    return 1;
  } else {
    return 0;
  }
}
