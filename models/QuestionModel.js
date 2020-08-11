//TODO: change thread id to not allow null?
const uuid = require("uuid");

exports.QuestionModel = (sequelize, DataTypes) => {
  const Question = sequelize.define(
    "question",
    {
      threadId: {
        type: DataTypes.INTEGER,
        field: "thread_id",
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "username",
      },
      question: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "question",
      },
      questionDetails: {
        type: DataTypes.STRING,
        field: "question_details",
      },
      isAnswered: {
        type: DataTypes.BOOLEAN,
        field: "is_answered",
      },
      commentCount: {
        type: DataTypes.INTEGER,
        field: "comment_count",
      },
    },
    { tableName: "questions" }
  );
  return Question;
};
