var express = require("express");
const dotenv = require("dotenv");
dotenv.config();
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
var http = require("http");
var db = require("./db");
const errorHandlers = require("./handlers/errorHandlers");
var debug = require("debug")("challenge-board-server:server");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const discordRouter = require("./routes/discord");
const questionsRouter = require("./routes/questions");
const commentsRouter = require("./routes/comments");
const projectsRouter = require("./routes/projects");

var port = process.env.PORT || "9000";
var server = http.createServer(app);
var app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://challengeboard.vercel.app"],
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

let forceDbReset = false;
db.sequelize.sync({ force: forceDbReset }).then(async () => {
  server.listen(port, () => console.log(`Server running on ${port}`));

  // seed db with teacher data
  // await authService.createTeacherUser(
  //   process.env.TEACHER_USERNAME,
  //   process.env.TEACHER_EMAIL,
  //   process.env.TEACHER_PASSWORD
  // );
});

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
