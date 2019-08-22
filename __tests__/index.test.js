const test = require('ava');
const express = require('express');
const middleware = require('..');
const request = require('supertest');

test.before(t => {
  const app = express();
  // Set up our middleware for testing
  app.use(middleware('routes', { cwd: __dirname }));
  // Add a catch-all 404
  app.use((req, res) => res.sendStatus(404));
  // Prepare the supertest agent for querying
  t.context.agent = request.agent(app);
});

test('it loads a function in routes.js', t => {
  return t.context.agent.get('/routes-function').then(response => {
    t.assert(response.status == 200);
  });
});
