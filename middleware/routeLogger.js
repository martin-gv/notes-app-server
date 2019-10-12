function routeLogger(req, res, next) {
  console.log("%s %s", req.method, req.originalUrl);
  next();
}

module.exports = routeLogger;
