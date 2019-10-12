const err = require("../helpers/errors");

function isAdmin(req, res, next) {
  const { role } = res.locals.token;
  if (role !== "admin") return next(err.AUTH_ERROR);
  next();
}

module.exports = isAdmin;
