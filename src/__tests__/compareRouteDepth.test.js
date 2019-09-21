const test = require('ava');
const compareRouteDepth = require('../compareRouteDepth');

test('Shorter routes go first', t => {
  t.assert(compareRouteDepth('/a/route', '/a/deeper/route') < 0);
  t.assert(compareRouteDepth('/a/deeper/route', '/a/route') > 0);
  t.assert(
    compareRouteDepth('/a/route/of/some/length', '/a/route/of/same/length') == 0
  );
});
