const test = require('ava');
const setupServer = require('./setupServer');
const { testResponse } = require('./lib/ava-supertest');

test.before(setupServer());

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
