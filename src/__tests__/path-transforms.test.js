const test = require('ava');
const setupServer = require('./setupServer');
const { testResponse } = require('./lib/ava-supertest');

test.before(setupServer());

// RESTART HERE!
test(
  'it treats `$paramName` folders as param placeholder',
  testResponse,
  '/param-name/in-folder/you',
  {
    text: 'Hello you!'
  }
);

test(
  'it treats `$paramName.<method>.<extension>` files as param placeholder',
  testResponse,
  '/param-name/in-file/you',
  {
    text: 'Hello you!'
  }
);

test(
  'it treats `__` as directory separator',
  testResponse,
  '/directory-separator/in/folder/or/name'
);
