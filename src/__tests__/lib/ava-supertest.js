const request = require('supertest');

module.exports = {
  // Helps setting up supertest
  setup(app) {
    return function(t) {
      t.context.agent = request.agent(app);
    };
  },
  // Macro for easily validating express responses
  testResponse(t, path, { status = 200, method = 'get', text } = {}) {
    return t.context.agent[method](path).then(
      ({ status: responseStatus, text: responseText }) => {
        t.assert(status == responseStatus);
        if (text) {
          console.log(responseText);
          t.assert(text == responseText);
        }
      }
    );
  }
};
