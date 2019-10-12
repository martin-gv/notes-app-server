const mysql = require("mysql");
const chalk = require("chalk");
const log = console.log;

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: 10, // default is 10
  multipleStatements: true // Can increase potential for SQL injection
};

const pool = mysql.createPool(config);
log(chalk.blue("Creating new pool"));

pool.on("connection", function(conn) {
  log(chalk.bgBlue.black(`New connection ${conn.threadId} made with pool`));
});

pool.on("enqueue", function() {
  log(chalk.bgYellow.black("Waiting for available connection"));
});

pool.on("acquire", function(conn) {
  log(`Connection ${conn.threadId} ${chalk.green("acquired")}`);
});

pool.on("release", function(conn) {
  log(`Connection ${conn.threadId} ${chalk.magenta("released")}`);
});

exports.pool = pool;
