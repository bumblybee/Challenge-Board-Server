"use strict";

const Sequelize = require("sequelize");
const UserModel = require("./models/user.js");
const ProjectModel = require("./models/project.js");
const QuestionModel = require("./models/question.js");
const CommentModel = require("./models/comment.js");

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

const User = UserModel(sequelize, Sequelize);
const Project = ProjectModel(sequelize, Sequelize);
const Question = QuestionModel(sequelize, Sequelize);
const Comment = CommentModel(sequelize, Sequelize);

User.hasMany(Project);

User.hasMany(Question);

User.hasMany(Comment);

Project.belongsTo(User);

Question.belongsTo(User);

Question.hasMany(Comment, { onDelete: "CASCADE" });

Comment.belongsTo(User);

Comment.belongsTo(Question, { onDelete: "CASCADE" });

// authenticate db
sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error:" + err));

module.exports = {
  sequelize,
  Sequelize,
  User,
  Project,
  Question,
  Comment,
};
