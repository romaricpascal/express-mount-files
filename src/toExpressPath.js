module.exports = function toExpressPath(routePath) {
  if (routePath) {
    return routePath.replace(/\$/g, ':').replace(/__/g, '/');
  } else {
    return '/';
  }
};
