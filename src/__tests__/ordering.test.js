const test = require('ava');
const setupServer = require('./setupServer');
const { testResponse } = require('./lib/ava-supertest');

test.before(setupServer('ordering'));

test(
  'deeper routes register their middlewares later',
  testResponse,
  '/ordering-routes/deeper/and-deeper'
);
test(
  'variable routes come after non variable ones',
  testResponse,
  '/ordering-routes/somewhere',
  { status: 201 }
);
test(
  'method files come after routes',
  testResponse,
  '/ordering-routes-method-files',
  { text: 'test' }
);
test(
  'deeper method files come first',
  testResponse,
  '/ordering-method-files/deeper',
  { text: 'deeper' }
);
test('method files with variables come after', t => {
  return Promise.all([
    // The route without variable gets its value
    testResponse(t, '/ordering-method-files/without-variable', {
      text: 'no-variable'
    }),
    // As well as the one with variable
    testResponse(t, '/ordering-method-files/with-variable', {
      text: 'with-variable'
    })
  ]);
});
test(
  'get method come after others',
  testResponse,
  '/ordering-method-files/get-last',
  { method: 'delete', text: 'get-last' }
);
test(
  'view handlers come after JS ones',
  testResponse,
  '/ordering-method-files/with-view',
  { text: 'with-view' }
);
