module.exports = function compareRouteDepth(routeA, routeB) {
  return routeA.split('/').length - routeB.split('/').length;
};
