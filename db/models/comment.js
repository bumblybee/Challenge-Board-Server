"use strict";

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "comment",
    {
      body: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "body",
      },
      isAnswer: {
        type: DataTypes.BOOLEAN,
        field: "is_answer",
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
    { tableName: "comment" }
  );

  return Comment;
};
