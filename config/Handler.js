const db = require("../models/index");
const err = require("../helpers/errors");

// Methods declared on instance using creator function because they are
// called as a callback by Express. Value of 'this' is not preserved unless bound.

// Handlers need try/catch to pass errors to the error handling middleware.
// If not they may be caught by the Express handler if sync code, or not at
// all if async code, and possibly crash the server.

function Handler(name) {
  if (!name) throw new Error("missing handler name");
  this.resource = name;

  this.getById = getById.bind(this);
  this.getAll = getAll.bind(this);
  this.create = create.bind(this);
  this.update = update.bind(this);
  this.deleteById = deleteById.bind(this);
  this.deleteAll = deleteAll.bind(this);
}

const getAll = async function(req, res, next) {
  try {
    const results = await db[this.resource].find({});
    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
};

const getById = async function(req, res, next) {
  try {
    const results = res.locals.resource;
    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
};

const create = async function(req, res, next) {
  try {
    const data = req.body;
    delete data.id;

    const { insertId } = await db[this.resource].create(data);
    const results = await db[this.resource].findById(insertId);

    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
};

const update = async function(req, res, next) {
  try {
    const data = req.body;
    const id = Number(req.params.id);

    // Remove fields silently to allow convenient updates from front-end.
    delete data.id;

    const role = res.locals.token.role;
    checkUpdateLocks.call(this, data, role);

    const results = await db[this.resource].findByIdAndUpdate(id, data);
    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
};

function checkUpdateLocks(data, role) {
  const locks = this.UPDATE_LOCKS;
  if (locks) {
    const keys = Object.keys(data);
    locks.forEach(function(el) {
      const restricted = el.fields;
      const found = keys.some(el => restricted.includes(el));
      if (found && role !== el.roleRequired) throw err.AUTH_ERROR;
    });
  }
}

const deleteById = async function(req, res, next) {
  try {
    const id = Number(req.params.id);
    const results = await db[this.resource].findByIdAndDelete(id);
    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
};

const deleteAll = async function(req, res, next) {
  try {
    const results = await db[this.resource].delete({});
    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
};

module.exports = Handler;
