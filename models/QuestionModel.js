exports.QuestionModel = (sequelize, DataTypes) => {
  const Question = sequelize.define(
    "question",
    {
      threadId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
        field: "thread_id",
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: "username",
      },
      question: {
        type: DataTypes.STRING,
        allNull: false,
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
