module.exports = {
  use: [
    function(req, res, next) {
      res.status(201);
      next();
    },
    function(req, res) {
      res.send('content');
    }
  ]
};
