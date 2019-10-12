const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 8080;

const errorHandler = require("./handlers/errors");
const routes = require("./routes/index");

app.use(bodyParser.json()); // axios default is json

app.use("/api", routes);
app.use(errorHandler);

app.listen(port, function() {
  console.log("Server running on port " + port);
});
