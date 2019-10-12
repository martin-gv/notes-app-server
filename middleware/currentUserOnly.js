const err = require("../helpers/errors");

function currentUserOnly(req, res, next) {
  const data = req.body;
  const token = res.locals.token;
  if (token.id !== data.user_id) throw err.AUTH_ERROR;
  next();
}

module.exports = currentUserOnly;
