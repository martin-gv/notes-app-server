/* 
  This file shows examples of SQL injection and allows you to see how external
  values should be escaped before interacting with the database.
*/

/*
  The pool database configuration needs the option
  multipleStatements: true to allow multiple SQL code statements
  to run together. One way of preventing SQL injection is to only 
  allow a single SQL statement with each database query.
*/
const db = require("../config/database");

const SQL_ASSIGN_ERROR =
  "ERROR: You must uncomment a statement assigning a value to the variable 'sql'";

/*
  SQL Injection Example
  Requires a table named 'drop_me' and a table for inserting notes (user_id, title)
*/
function exampleSQLInjection() {
  //Example test data that is safe to insert
  const safeInsert = "`user_id` = 5, `title` = 'Test note!'";

  // The next statement includes an SQL injection to drop the table 'drop_me'.
  const withSQLInjection =
    "`user_id` = 5, `title` = 'Test note!'; DROP TABLE drop_me; -- ";

  let sql;

  //  Uncomment either statement to test out:
  // const sql = "INSERT INTO Note SET " + safeInsert;
  // const sql = "INSERT INTO Note SET " + withSQLInjection;

  if (sql) return execute(sql);
  console.log(SQL_ASSIGN_ERROR);
}

/*
  Example showing sanitization with mysql escape function. This is
  important to do when dealing with externally provided values.
*/
function escapingValuesForSafeInsert() {
  /*
    mysql.escape() safely escapes any SQL found in strings. With this example,
    it will also convert the array to a string of comma seperated values.
  */
  const valuesToInsert = [1, "A note title'); DROP TABLE drop_me;"];

  // Final escaped string: "1, 'A note title\'); DROP TABLE drop_me;'"
  const safeValues = db.pool.escape(valuesToInsert);

  /*
    Below is a theoretical example showing the array converted to a string of
    comma seperated values, but this time with no escaping. Note that without
    the escape character '\', the SQL will be parsed as multiple statements.
    mysql.escape() makes sure that arrays converted in this way are safely escaped.
  */
  const unescaped = "1, 'A note title'); DROP TABLE drop_me; -- ";

  let sql;

  // Uncomment either statement to test:
  // sql = `INSERT INTO Note (user_id, title) VALUES (${safeValues})`;
  // sql = `INSERT INTO Note (user_id, title) VALUES (${unescaped})`;

  if (sql) return execute(sql);
  console.log(SQL_ASSIGN_ERROR);
}

/*
  Uncomment the functions below to test out. Inside the function that
  you will test out, make sure to uncomment either of the statements
  assigning a value to the variable 'sql'.
*/

// exampleSQLInjection();
// escapingValuesForSafeInsert();

// Helper function to get connection from pool, run query, and log results
function execute(sql) {
  db.pool.query(sql, function(error, results, fields) {
    if (error) return console.log(error);
    console.log(results);
  });
}
