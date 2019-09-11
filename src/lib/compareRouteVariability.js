module.exports = function compareRouteVariability(routeA,routeB) {
  return getVariability(routeA) - getVariability(routeB)
}

function tokenizeRoute(route){
  return route.split('/');
}

function getVariability(route){
  const tokens = tokenizeRoute(route);
  return tokens.reduce((variability,token) => {
    const bit = token.indexOf(':') !== -1 ? 1 : 0;
    // Shift left to make space for the new bit
    // and OR it in
    return (variability << 1) | bit;
  })
}
