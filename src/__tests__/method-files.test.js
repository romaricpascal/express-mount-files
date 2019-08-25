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
