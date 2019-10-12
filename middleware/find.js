const db = require("../models/index");
const err = require("../helpers/errors");

function saveParam(param) {
  return function(req, res, next) {
    const id = Number(req.params[param]);
    res.locals.id = id;
    next();
  };
}

function saveFromBody(key) {
  return function(req, res, next) {
    const id = Number(req.body[key]);
    res.locals.id = id;
    next();
  };
}

async function findResource(req, res, next) {
  try {
    const { id, RESOURCE_NAME } = res.locals;

    const resource = await db[RESOURCE_NAME].findById(id);
    if (!resource) throw err.NOT_FOUND;
    res.locals.resource = resource;

    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Module exports:
 * 1. find          : find by "id" route parameter
 * 2. find.by       : find by route parameter passed in as function parameter
 * 3. find.body     : find by "id" key in request body
 * 4. find.body.by  : find by request body key passed in as function parameter
 */

// Default usage (no parameter passed to function)
const find = [saveParam("id"), findResource];

// Requires specifying route parameter to search by
find.by = findByParam;
function findByParam(param) {
  return [saveParam(param), findResource];
}

// Default usage (no parameter passed to function
find.body = [saveFromBody("id"), findResource];

// Requires specifying body key to search by
find.body.by = findFromBody;
function findFromBody(key) {
  return [saveFromBody(key), findResource]
}

module.exports = find;
