const util = require("../helpers/util");
const err = require("../helpers/errors");

function checkReqBody(req, res, next) {
  const { body } = req;
  if (util.isEmpty(body)) return next(err.EMPTY_REQUEST_BODY);
  if (util.typeOf(body) !== "object") return next(err.REQUEST_BODY_ERROR);
  next();
}

module.exports = checkReqBody;
