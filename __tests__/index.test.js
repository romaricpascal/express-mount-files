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

// All tests will be the same, send request to a given URL
// and check the return status (200) and possibly the content
function testResponse(t, path, { status = 200, method = 'get', body } = {}) {
  return t.context.agent[method](path).then(response => {
    t.assert(response.status == status);
    if (body) {
      t.assert(body == response.text);
    }
  });
}

test('it loads a function in routes.js', testResponse, '/routes-function');
test('it loads an object in routes.js', testResponse, '/routes-object');
test('it loads an object in routes.js - POST', testResponse, '/routes-object', {
  method: 'post'
});
test('it loads an array in routes.js', testResponse, '/routes-array', {
  status: 201,
  body: 'content'
});
