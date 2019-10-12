# Notes App Server

An Express API server running on Node that provides the back-end functionality for the Notes App. It connects to a MySQL database.

### Required environment variables

* DB_HOST: database host URL
* DB_USER: database user
* DB_PASSWORD: database user's password
* DB_DATABASE: database name
* JWT_SECRET_KEY: a string used to authenticate JWT tokens

### Setting up the database

See the file `sql/create.sql` and `notes/database.md`