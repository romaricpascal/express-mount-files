module.exports = [
  function(req, res, next) {
    res.locals.fromRoute = true;
    next();
  }
];
