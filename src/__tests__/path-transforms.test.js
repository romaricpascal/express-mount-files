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
  'it treats `$paramName.<method>.js` files as param placeholder',
  testResponse,
  '/param-name/in-file/you',
  {
    text: 'Hello you!'
  }
);
