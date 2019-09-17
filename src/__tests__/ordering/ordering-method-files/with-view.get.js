module.exports = function(req, res, next) {
  res.locals.value = 'with-view';
  next();
};
