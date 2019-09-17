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
