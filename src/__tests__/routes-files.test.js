const test = require('ava');
const express = require('express');
const middleware = require('..');
const { setup, testResponse } = require('./lib/ava-supertest');

test.before(t => {
  const app = express();
  // Set up our middleware for testing
  app.use(middleware('routes', { cwd: __dirname }));
  // Add a catch-all 404
  app.use((req, res) => res.sendStatus(404));
  // Prepare the supertest agent for querying
  setup(app)(t);
});

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
  'it loads the middlewares set in the use key of a route object',
  testResponse,
  '/routes-use',
  {
    status: 201,
    body: 'content'
  }
);
