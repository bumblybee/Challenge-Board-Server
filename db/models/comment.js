"use strict";

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "comment",
    {
      body: {
        type: DataTypes.TEXT,
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
      deletedAt: {
        type: DataTypes.DATE,
        field: "deleted_at",
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },

    { tableName: "comment" }
  );

  return Comment;
};
