module.exports = [
  function(req, res) {
    if (res.locals.fromRoute) {
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  }
];
