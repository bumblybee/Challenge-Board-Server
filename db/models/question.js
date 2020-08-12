"use strict";

module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define(
    "question",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "title",
      },
      body: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "body",
      },
      isAnswered: {
        type: DataTypes.BOOLEAN,
        field: "is_answered",
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at",
      },
    },
    { tableName: "question" }
  );

  return Question;
};
