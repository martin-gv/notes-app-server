const mysql = require("mysql");
const util = require("./util");

// Converts empty strings to null
exports.noEmptyStrings = function(obj) {
  Object.keys(obj).forEach(function(el) {
    if (obj[el] === "") obj[el] = null;
  });
};

// Splits object into two arrays (keys and values)
exports.splitObject = function(obj) {
  const keys = Object.keys(obj);
  const values = keys.map(el => obj[el]);
  return [keys, values];
};

// Return formatted WHERE conditions
exports.getConditions = function() {
  const self = this;

  const queryKeys = Object.keys(self.query);
  const conditionKeys = queryKeys.filter(function(el) {
    return el.substring(0, 1) !== "$";
  });

  const statements = conditionKeys.map(function(el) {
    const field = mysql.escapeId(el);
    const value = mysql.escape(self.query[el]);
    const table = field.includes(".") ? "" : `${self.TABLE_NAME}.`;
    return `${table}${field} = ${value}`;
  });

  // const expression = statements.join(" AND ");
  // return expression;
  return statements;
};

// Get query options, denoted by $ at the beginning of the key
exports.getOptions = function(query) {
  const entries = Object.entries(query);

  const options = entries.filter(function(el) {
    const key = el[0];
    const firstChar = key.substring(0, 1);
    return firstChar === "$";
  });

  return options;
};

// Find value in query by specified key (e.g. $join)
function getByKey(key, query) {
  return query[key];
}

// Get full-text search from special key
exports.getSearch = function() {
  const $ft_search = getByKey("$ft_search", this.query);
  if (!$ft_search) return "";

  const terms = $ft_search;
  const formatted = terms.map(el => `+${el}*`).join(" ");
  const values = mysql.escape(formatted);

  const fields = mysql.escapeId(this.FULL_TEXT_FIELDS);
  const expression = `MATCH (${fields}) AGAINST (${values} IN BOOLEAN MODE)`;

  return expression;
};

// Return formatted SQL string for join
exports.getJoin = function() {
  const $join = getByKey("$join", this.query);
  if (!$join) return "";

  const joinTable = $join.table;
  const joinField = $join.field;
  const expression = `JOIN ${joinTable} ON ${joinTable}.${joinField} = ${
    this.TABLE_NAME
  }.id`;

  return expression;
};

// Get sort from special key
exports.getSort = function() {
  const $sort = getByKey("$sort", this.query);
  if (!$sort) return "";

  const [[key, value]] = Object.entries($sort);
  const field = key;
  const order = value === -1 ? "DESC" : value === 1 ? "ASC" : null;
  if (!order) throw Error(`invalid sort value on ${this.TABLE_NAME}`);

  const expression = `ORDER BY ${this.TABLE_NAME}.${field} ${order}`;
  return expression;
};

exports.defaultSort = function() {
  return `ORDER BY ${this.TABLE_NAME}.id DESC`;
};

// Return formatted SQL string for limit
exports.getLimit = function() {
  const $limit = getByKey("$limit", this.query);
  if (!$limit) return "";
  return "LIMIT " + $limit;
};

exports.defaultLimit = function() {
  return "LIMIT " + this.DEFAULT_LIMIT;
};

// Return formatted SQL string for skip
exports.getSkip = function() {
  const $skip = getByKey("$skip", this.query);
  if (!$skip) return "";
  return "OFFSET " + $skip;
};

exports.defaultSkip = function() {
  return "OFFSET " + this.DEFAULT_SKIP;
};

exports.isValidUpdate = function(data) {
  if (util.typeOf(data) !== "object")
    throw Error("update data must be an object");
};
