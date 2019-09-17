module.exports = function(req, res) {
  res.send(res.locals.value);
};
