var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

const errorHandlers = require("./handlers/errorHandlers");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const questionsRouter = require("./routes/questions");
const discordRouter = require("./routes/discord");

var app = express();

app.use(
  cors({
    origin: ["http://127.0.0.1:3000", "https://temporary-heat.surge.sh"],
    credentials: true,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/questions", questionsRouter);
app.use("/discord", discordRouter);

//error handlers

app.use(errorHandlers.notFound);

if (app.get("env") === "development") {
  app.use(errorHandlers.developmentErrors);
} else {
  app.use(errorHandlers.productionErrors);
}

module.exports = app;
