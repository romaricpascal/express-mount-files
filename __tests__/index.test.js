const test = require('ava');
const express = require('express');
const middleware = require('..');
const request = require('supertest');
const path = require('path');

test.before(t => {
  const app = express();
  // Set up our middleware for testing
  app.use(middleware(path.join(__dirname, 'routes')));
  // Add a catch-all 404
  app.use((req, res) => res.sendStatus(404));
  // Prepare the supertest agent for querying
  t.context.agent = request.agent(app);
});

test('it loads a function in routes.js', t => {
  return t.context.agent.get('/').then(response => {
    t.assert(response.status == 404);
  });
});
