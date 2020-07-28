const Sequelize = require("sequelize");
const { QuestionModel } = require("./QuestionModel");
const { UserModel } = require("./UserModel");

const env = process.env.NODE_ENV || "development";

let sequelize;

if (env !== "production") {
  sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    { dialect: "postgres", logging: false }
  );
} else {
  sequelize = new Sequelize(process.env.DATABASE_URL);
}

// authenticate db
sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error:" + err));

const Question = QuestionModel(sequelize, Sequelize);
const User = UserModel(sequalize, Sequelize);

module.exports = { Sequelize, sequelize, Question };
