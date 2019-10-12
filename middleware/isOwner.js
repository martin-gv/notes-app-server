const err = require("../helpers/errors");

function isOwner(req, res, next) {
  const { token, resource } = res.locals;
  if (token.id !== resource.user_id) throw err.AUTH_ERROR;
  next();
}

module.exports = isOwner;
