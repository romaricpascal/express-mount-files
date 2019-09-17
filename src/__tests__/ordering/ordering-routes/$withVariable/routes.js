module.exports = [
  function(req, res) {
    if (res.locals.fromRoute) {
      res.sendStatus(201);
    } else {
      res.sendStatus(400);
    }
  }
];
