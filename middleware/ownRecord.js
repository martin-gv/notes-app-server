const err = require("../helpers/errors");

function ownRecord(req, res, next) {
  const id = Number(req.params.id);
  const token = res.locals.token;
  if (token.id !== id) throw err.AUTH_ERROR;
  next();
}

module.exports = ownRecord;
