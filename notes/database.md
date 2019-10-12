# Database Notes

### XAMPP
* Edit xampp/mysql/bin/my.ini
* After changes restart MySQL service in the XAMPP control panel

### Global Variables
* View global variable values with SQL: `SHOW GLOBAL VARIABLES LIKE 'innodb_ft_min_token_size';`
* Some variables are read-only and can't be modified by SQL queries; they must be configured at startup (e.g. my.ini file)

---

## my.ini Edits
Add to the [mysqld] section:

#### innodb_ft_min_token_size = 1
* Sets the minimum "token" size for full-text indexes
* Rebuild indexes after modifying this variable

#### skip_innodb_ft_enable_stopword
* Disables the stopword list for full-text indexes
* Rebuild indexes after modifying this variable
* Check value with 'innodb_ft_enable_stopword' (without 'skip_')

#### sql_mode="STRICT_TRANS_TABLES"
* Sets strict mode (for preventing implicit defaults such as '' or 0 on insert)
* Dynamic variable; can be modified with query
* Check value with SHOW VARIABLES or SELECT @@sql_mode
* Default value: `IGNORE_SPACE,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION`

#### lower_case_table_names = 2
* Keeps case-sensitive table names on Windows and Mac
* Do not use the following on Windows or Mac: lower_case_table_names = 0

---

### Rebuilding indexes:
* Index names for each table can be found in phpMyAdmin
* Example SQL to rebuild indexes:
`ALTER TABLE notes DROP INDEX title;
ALTER TABLE notes ADD FULLTEXT (title, content);`

---

### SQL Injection

It's best practice to use the `mysql` package's escape functions such as `mysql.escape()` and `mysql.escapeId()` to escape any values from external sources. These functions work on both objects and arrays and, in addition, translate them to SQL friendly formats (e.g. comma seperated list of values for arrays) 

* See `escapingValues.js` for examples of SQL injection and escaping functions

### MySQL

MySQL syntax requires a space after -- style comments.

Order of table creation is important:
```
Error: ER_CANT_CREATE_TABLE: Can't create table `notes_demo`.`notes` (errno: 150 "Foreign key constraint is incorrectly formed")
```

Note that the SQL language mode in VS Code highlights the pattern `user_id` because this is a special security function in SQL Server 2012 and above.