const test = require('ava');
const setupServer = require('./setupServer');
const { testResponse } = require('./lib/ava-supertest');

test.before(setupServer());

test('it loads handler function at the root', testResponse, '/');
test(
  'it loads handler function from files in the folder',
  testResponse,
  '/method-file-js'
);
test(
  'it loads handler function from files in the folder - POST',
  testResponse,
  '/method-file-js',
  { method: 'post' }
);
test(
  'it loads handler array from files in the folder',
  testResponse,
  '/method-file-array-js',
  {
    status: 201,
    text: 'content'
  }
);
test(
  'it sets the name of the file as path',
  testResponse,
  '/method-file-with-path-js/routes'
);
test(
  'it does not handle paths for which no route is defined',
  testResponse,
  '/method-file-with-path-js/not-defined',
  { status: 404 }
);
