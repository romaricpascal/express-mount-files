const test = require('ava');
const setupServer = require('./setupServer');
const { testResponse } = require('./lib/ava-supertest');

test.before(setupServer());

// All tests will be the same, send request to a given URL
test('it loads a function in routes.js', testResponse, '/routes-function');
test('it loads an object in routes.js', testResponse, '/routes-object');
test('it loads an object in routes.js - POST', testResponse, '/routes-object', {
  method: 'post'
});
test(
  'it ignores deeper paths when loading an object',
  testResponse,
  '/routes-object/path/not-defined',
  { status: 404 }
);
test('it loads an array in routes.js', testResponse, '/routes-array', {
  status: 201,
  body: 'content'
});
test(
  'it loads the function set in the use key of a route object as a middleware',
  testResponse,
  '/routes-use',
  {
    status: 201,
    text: 'content'
  }
);
test(
  'it loads the array of functions set in the use key of a route object as middlewares',
  testResponse,
  '/routes-use-array',
  {
    status: 201,
    text: 'content'
  }
);
