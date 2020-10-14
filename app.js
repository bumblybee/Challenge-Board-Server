var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");

const errorHandlers = require("./handlers/errorHandlers");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const discordRouter = require("./routes/discord");
const questionsRouter = require("./routes/questions");
const commentsRouter = require("./routes/comments");
const projectsRouter = require("./routes/projects");

var app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://challengeboard.vercel.app",
      "https://challengeboard.xyz",
      "http://challenge-board.herokuapp.com/challenge",
    ],
    credentials: true,
  })
);

app.use(compression());
app.use(helmet());

const morganLogStyle = app.get("env") === "development" ? "dev" : "common";
app.use(logger(morganLogStyle));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/discord", discordRouter);
app.use("/questions", questionsRouter);
app.use("/comments", commentsRouter);
app.use("/projects", projectsRouter);

//error handlers

app.use(errorHandlers.notFound);
app.use(errorHandlers.sequelizeErrorHandler);

if (app.get("env") === "development") {
  app.use(errorHandlers.developmentErrors);
} else {
  app.use(errorHandlers.productionErrors);
}

if (process.env.NODE_ENV === "development") {
  console.log("Working in dev environment");
}

if (process.env.NODE_ENV === "production") {
  console.log("Working in prod environment");
}

module.exports = app;
