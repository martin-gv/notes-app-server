-- CREATE DATABASE notes_demo;
-- USE notes_demo;

-- Order matters because of foreign keys
DROP TABLE IF EXISTS
   notes_tags_link, notes, tags, users
;

/*
On insert, if no DEFAULT value is specified for a column, MySQL automatically assigns one
as follows. If the column may take NULL as a value, the default value is NULL.
If the column is declared as NOT NULL, the default value depends on the column type.
Usually '' for a text-style column and 0 for a numerical.

However, in strict mode omitting a value for a NOT NULL column will result in an error
and the statement will be rolled back in transactional tables. InnoDB tables are 
transactional. The type of a table can be checked with SHOW TABLE STATUS.

NOT NULL prevents blanks when new records are inserted, but does not prevent
empty strings on inserts or updates. One solution is to check for and convert
empty strings to null before inserting.

Primary keys are implictly declared as not null (this is a requirement for primary keys).

A unique key creates an index with the unique constraint.

BOOLEAN is a synonym for TINYINT(1). 0 is false, 1 is true
*/

CREATE TABLE User (
   id INT AUTO_INCREMENT,
   username VARCHAR(255) NOT NULL,
   email VARCHAR(255) NOT NULL,
   password VARCHAR(255) NOT NULL,
   role VARCHAR(10) NOT NULL DEFAULT 'user',
   active BOOLEAN NOT NULL DEFAULT 1,
   created_at TIMESTAMP NOT NULL DEFAULT NOW(),
   updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
   PRIMARY KEY(id),
   UNIQUE KEY uq_user_username (username),
   UNIQUE KEY uq_user_email (email)
);

/*
A PRIMARY KEY can be a multiple-column index. However, you cannot create
a multiple-column index using the PRIMARY KEY key attribute in a column
specification. You must use a separate PRIMARY KEY(key_part, ...) clause.

In MySQL, the name of a PRIMARY KEY is PRIMARY. For other indexes, if you do
not assign a name, the index is assigned the same name as the first indexed column,
with an optional suffix (_2, _3, ...) to make it unique. You can see index names
for a table using SHOW INDEX FROM tbl_name.
*/

CREATE TABLE Note (
   id INT AUTO_INCREMENT,
   user_id INT NOT NULL,
   title VARCHAR(255),
   content TEXT,
   created_at TIMESTAMP NOT NULL DEFAULT NOW(),
   updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
   PRIMARY KEY (id),
   FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
   FULLTEXT ft_note_search (title, content)
);

/* 
A fulltext index combines columns listed, sanitizes (e.g. removes punctuation, lowercases),
and automatically updates when content in the column changes. It is much faster than using
LIKE in queries. Only supported in CHAR, VARCHAR, and TEXT fields.

Optimizations are applied to certain kinds of FULLTEXT queries against single InnoDB tables.
Queries with these characteristics are particularly efficient: FULLTEXT queries that only return
the document ID, or the document ID and the search rank. FULLTEXT queries that sort the matching
rows in descending order of score and apply a LIMIT clause to take the top N matching rows.
For this optimization to apply, there must be no WHERE clauses and only a single ORDER BY clause
in descending order. See documentation for more.
*/

CREATE TABLE Tag (
   id INT AUTO_INCREMENT,
   user_id INT NOT NULL,
   tag_name VARCHAR(255) NOT NULL,
   created_at TIMESTAMP NOT NULL DEFAULT NOW(),
   updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
   FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
   PRIMARY KEY (id),
   UNIQUE KEY uq_tag_userid_tagname (user_id, tag_name)
);

/*
UNIQUE and UNIQUE KEY are synonymous and create an index. A unique key is a special
case of index - acting like a regular index with added check for uniqueness.

INDEX and KEY aren't quite the same. A KEY is a constraint, and 
an INDEX is a data structure necessary to implement a constraint.

MySQL requires indexes on foreign keys and referenced keys so that foreign key
checks can be fast and not require a table scan. In the referencing table, there
must be an index where the foreign key columns are listed as the first columns in
the same order. Such an index is created on the referencing table automatically if
it does not exist. This index might be silently dropped later, if you create another
index that can be used to enforce the foreign key constraint.
*/


/*
Relationship table only has created_at, because entries can only be removed, not updated
*/
CREATE TABLE TaggedBy (
   note_id INT NOT NULL,
   tag_id INT NOT NULL,
   created_at TIMESTAMP NOT NULL DEFAULT NOW(),
   FOREIGN KEY (note_id) REFERENCES Note(id) ON DELETE CASCADE,
   FOREIGN KEY (tag_id) REFERENCES Tag(id) ON DELETE CASCADE,
   UNIQUE KEY uq_taggedby_noteid_tagid (note_id, tag_id)
);

/*

   To see list of default stopwords:
   SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_DEFAULT_STOPWORD;

   Alternate stop word setup using a custom stopword table:

   1) Create the table:
   INSERT INTO my_stopwords(value) VALUES ('nope');

   2) Check if stopwords are enabled (on/off): 
   SHOW GLOBAL VARIABLES LIKE 'innodb_ft_enable_stopword';

   If stopwords are disabled (off), then check that the my.ini file doesn't
   include the following setting: 'skip_innodb_ft_enable_stopword'

   3) Check name of custom stopword table
   SHOW GLOBAL VARIABLES LIKE 'innodb_ft_server_stopword_table';

   4) Rebuild any indexes if necessary:
   ALTER TABLE Note DROP INDEX ft_notes_search;
   ALTER TABLE Note ADD FULLTEXT ft_notes_search (title, content);

   Note: whenever the MySQL server is restarted (e.g. in XAMPP) the stopword table needs to be re-set:
   SET GLOBAL innodb_ft_server_stopword_table = 'notes_demo/my_stopwords';

*/