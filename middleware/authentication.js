const verifyToken = require("../helpers/verifyToken");

async function authentication(req, res, next) {
  try {
    // Check for header
    if (!req.headers.authorization) throw Error("authorization header missing");

    // Get bearer token
    const authHeaderValue = req.headers.authorization.split(" ");
    const token = authHeaderValue[1];
    if (!token) throw Error("bearer token missing");

    const decoded = verifyToken(token, "access");
    res.locals.token = decoded;

    next();
  } catch (err) {
    // 401 triggers a token refresh on front-end
    if (err.name === "TokenExpiredError") err.status = 401;
    next(err);
  }
}

module.exports = authentication;
