module.exports = function(req, res) {
  res.status(200).send(`Hello ${req.params.name}!`);
};
