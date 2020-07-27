var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
require("dotenv").config({ path: __dirname + "/.env" });

const errorHandlers = require("./handlers/errorHandlers");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const questionsRouter = require("./routes/questions");

var app = express();
// var env = process.env.NODE_ENV || "development";

const whitelist = [
  "http://localhost:3000",
  "http://localhost:9000",
  "https://hushed-wool.surge.sh/",
];

// if (app.get(env) === "development") {
//   whitelist.push("http://localhost:3000", "http://localhost:9000");
// } else {
//   whitelist.push("https://glistening-coast.surge.sh");
// }

const corsOptions = {
  origin: function (origin, cb) {
    if (whitelist.indexOf(origin) !== -1) {
      cb(null, true);
    } else {
      cb(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/questions", questionsRouter);

//error handlers

app.use(errorHandlers.notFound);

if (app.get("env") === "development") {
  app.use(errorHandlers.developmentErrors);
} else {
  app.use(errorHandlers.productionErrors);
}

module.exports = app;
