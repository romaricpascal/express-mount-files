const fastGlob = require('fast-glob');
const path = require('path');
const HTTP_METHODS = require('./HTTP_METHODS');
const toExpressPath = require('./toExpressPath');
const compareRouteDepth = require('./compareRouteDepth');
const compareRouteVariability = require('./compareRouteVariability');

module.exports = function mountRoutes(
  router,
  root,
  { routes = [], viewExtensions = [], paramChar }
) {
  routes
    .concat(discoverRoutes(root, { viewExtensions, paramChar }))
    .sort((routeA, routeB) => {
      return (
        -1 * compareRouteDepth(routeA.routePath, routeB.routePath) ||
        compareRouteVariability(routeA.routePath, routeB.routePath) ||
        compareMethod(routeA.method, routeB.method) ||
        compareExtension(routeA.extension, routeB.extension)
      );
    })
    .forEach(({ method, routePath, handler }) => {
      router[method]('/' + routePath, handler);
    });
};

function discoverRoutes(root, { viewExtensions, paramChar }) {
  return fastGlob
    .sync(
      `**/{*.,}(${HTTP_METHODS.join('|')}).(${['js', ...viewExtensions].join(
        '|'
      )})`,
      {
        cwd: root
      }
    )
    .map(filePath => {
      const fullPath = path.resolve(root, filePath);
      const { routePath, method, extension } = configForFile(filePath);

      const handler = getHandler(fullPath, extension);
      return {
        fullPath,
        routePath: toExpressPath(routePath, { paramChar }),
        method,
        extension,
        handler
      };
    });
}

function configForFile(filePath) {
  // Ending `$` ensure we match exact paths and we don't handle paths
  // that have not been defined.
  // The inital non-capturing group serves for handling the `get.js` files
  // straight in the root folder, for which there's no preceding filename or path
  const r = new RegExp(`(?:(.*)[/.]|)(${HTTP_METHODS.join('|')}).(.*?)$`);
  const [
    ,
    // ^ ignore first param
    routePath,
    method,
    extension
  ] = r.exec(filePath);
  return { routePath, method, extension };
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
  if (methodA == methodB) {
    return 0;
  }
  // We want A last if it's get
  if (methodA == 'get') {
    return 1;
  }
  // We want B last if it's get
  if (methodB == 'get') {
    return -1;
  }
  return 0;
}
