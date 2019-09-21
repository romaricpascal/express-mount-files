module.exports = function toExpressPath(routePath) {
  return routePath.replace(/\$/g, ':').replace(/__/g, '/');
};
