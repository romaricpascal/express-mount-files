const test = require('ava');
const setupServer = require('./setupServer');
const { testResponse } = require('./lib/ava-supertest');

test.before(setupServer());

test('renders the view template', testResponse, '/view-rendering?name=test', {
  text: 'Hello test!'
});

test('sets the name of file as path', testResponse, '/view-rendering/get', {
  text: 'Hello from get!',
  method: 'post'
});

test(
  'does not make resolving partials a pain',
  testResponse,
  '/view-rendering/with-partial',
  {
    text: 'Hello from partial!'
  }
);

test(
  'does not make resolving layouts a pain',
  testResponse,
  '/view-rendering/with-layout',
  {
    text: 'yeah! Hello from the template!'
  }
);
