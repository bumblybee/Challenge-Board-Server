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
        type: DataTypes.TEXT,
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
      deletedAt: {
        type: DataTypes.DATE,
        field: "deleted_at",
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
    { tableName: "question" }
  );

  return Question;
};
