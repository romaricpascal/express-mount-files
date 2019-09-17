module.exports = function(req, res, next) {
  res.locals.value = 'get-last';
  // Forward to the 'get' handler
  req.method = 'get';
  next();
};
