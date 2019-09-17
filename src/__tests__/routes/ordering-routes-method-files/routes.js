module.exports = [
  function(req, res, next) {
    res.locals.value = 'test';
    next();
  }
];
