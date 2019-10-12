function setResource(name) {
  return function(req, res, next) {
    res.locals.RESOURCE_NAME = name;
    next();
  };
}

module.exports = setResource;
