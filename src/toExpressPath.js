module.exports = function toExpressPath(routePath, { paramChar }) {
  if (routePath) {
    return routePath
      .replace(new RegExp(`\\${paramChar}`, 'g'), ':')
      .replace(/__/g, '/');
  } else {
    return '/';
  }
};
