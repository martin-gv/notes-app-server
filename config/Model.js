const mysql = require("mysql");

const database = require("./database");
const dbh = require("../helpers/database");
const util = require("../helpers/util");

// Model functions saved on prototype can only be called directly to preserve the
// value of 'this'. They cannot be passed by reference (e.g. to Express middleware)

function Model(name) {
  if (!name) throw new Error("missing model name");
  this.TABLE_NAME = name;

  // Default values can be overriden after initialization
  this.DEFAULT_LIMIT = 10;
  this.DEFAULT_SKIP = 0;
  this.DANGER_DELETE_ALL = false;
  this.DANGER_UPDATE_ALL = false;
}

Model.prototype.create = function(data) {
  dbh.noEmptyStrings(data);

  let [columns, values] = dbh.splitObject(data);
  columns = mysql.escapeId(columns);
  values = mysql.escape(values);

  const sql = `INSERT INTO ${this.TABLE_NAME} (${columns}) VALUES (${values})`;
  return execute(sql);
};

Model.prototype.find = function(query) {
  const type = util.typeOf(query);
  if (type === "undefined" || (type === "object" && util.isEmpty(query)))
    return findAll.call(this);
  if (type === "object") return findByQuery.call(this, query);
  throw Error(`invalid param for ${this.TABLE_NAME}.find`);
};

Model.prototype.findById = async function(id) {
  const results = await findByQuery.call(this, { id });
  return results[0];
};

// By default, returns most recent document matching criteria
Model.prototype.findOne = async function(query) {
  const results = await findByQuery.call(this, query);
  return results[0];
};

async function findAll() {
  const results = await findByQuery.call(this, {});
  return results;
}

function findByQuery(query) {
  this.query = query;

  const conditions = dbh.getConditions.call(this);
  const join = dbh.getJoin.call(this);
  const search = dbh.getSearch.call(this);

  const sort = dbh.getSort.call(this) || dbh.defaultSort.call(this);
  const limit = dbh.getLimit.call(this) || dbh.defaultLimit.call(this);
  const skip = dbh.getSkip.call(this) || dbh.defaultSkip.call(this);

  if (search) conditions.push(search);
  const where = conditions.length ? "WHERE " + conditions.join(" AND ") : "";

  const sql = `SELECT * FROM ${this.TABLE_NAME}
    ${join} \n ${where} \n ${sort} \n ${limit} \n ${skip}`;

  return execute(sql);
}

Model.prototype.update = function(query, data) {
  dbh.isValidUpdate(data);
  const type = util.typeOf(query);
  if (type === "object" && util.isEmpty(query))
    return updateAll.call(this, data);
  if (type === "object") return updateByQuery.call(this, query, data);
  throw Error(`invalid param for ${this.TABLE_NAME}.update`);
};

Model.prototype.findByIdAndUpdate = async function(id, data) {
  dbh.isValidUpdate(data);
  const results = await updateByQuery.call(this, { id }, data);
  return results;
};

async function updateAll(data) {
  if (!this.DANGER_UPDATE_ALL)
    throw Error(`${this.TABLE_NAME}.updateAll disabled by default`);

  const results = await updateByQuery.call(this, {}, data);
  return results;
}

function updateByQuery(query, data) {
  this.query = query;
  dbh.noEmptyStrings(data);

  // Options not permitted
  const join = dbh.getJoin.call(this);
  const sort = dbh.getSort.call(this);
  const limit = dbh.getLimit.call(this);
  const skip = dbh.getSkip.call(this);
  if (join || sort || limit || skip)
    throw { message: "invalid option in query" };

  // .escape() uses .escapeId() in object keys
  const assignments = mysql.escape(data);

  const conditions = dbh.getConditions.call(this);
  const search = dbh.getSearch.call(this);

  if (search) conditions.push(search);
  const where = conditions.length ? "WHERE " + conditions.join(" AND ") : "";

  const sql = `UPDATE ${this.TABLE_NAME} SET ${assignments} ${where}`;

  return execute(sql);
}

Model.prototype.delete = function(query) {
  const type = util.typeOf(query);
  if (type === "undefined" || (type === "object" && util.isEmpty(query)))
    return deleteAll.call(this);
  if (type === "object") return deleteByQuery.call(this, query);
  throw Error(`invalid param for ${this.TABLE_NAME}.delete`);
};

Model.prototype.findByIdAndDelete = async function(id) {
  const results = await deleteByQuery.call(this, { id, title: "banana" });
  return results;
};

async function deleteAll() {
  if (!this.DANGER_DELETE_ALL)
    throw Error(`${this.TABLE_NAME}.deleteAll disabled by default`);

  const results = await deleteByQuery.call(this, {});
  return results;
}

function deleteByQuery(query) {
  this.query = query;

  const options = dbh.getOptions(query);
  if (options.length) throw { message: "invalid option in query" };

  const conditions = dbh.getConditions.call(this);
  const where = conditions.length ? "WHERE " + conditions.join(" AND ") : "";

  const sql = `DELETE FROM ${this.TABLE_NAME} ${where}`;
  return execute(sql);
}

function execute(sql) {
  return new Promise(function(resolve, reject) {
    database.pool.query(sql, function(error, results, fields) {
      if (error) return reject(error);
      resolve(results);
    });
  });
}

module.exports = Model;
