module.exports = {
  use(req, res, next) {
    res.status(201);
    next();
  },
  get(req, res) {
    res.send('content');
  }
};
