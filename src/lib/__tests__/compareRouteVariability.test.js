const test = require('ava');
const compareRouteVariability = require('../compareRouteVariability');

test('Deepest variable goes last', t => {
  t.assert(compareRouteVariability('/a/:b/c', '/a/b/c') > 0);
  t.assert(compareRouteVariability('/a/b/c', '/a/:b/c') < 0);
  t.assert(compareRouteVariability('/a/b/:c', '/a/:b/c') < 0);
  t.assert(compareRouteVariability('/a/:b/c', '/a/b/:c') > 0);
  t.assert(compareRouteVariability('/a/:b/:c', '/a/b/:c') > 0);
  t.assert(compareRouteVariability('/a/:b/:c', '/a/:b/c') > 0);
});
