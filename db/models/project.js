"use strict";

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define(
    "project",
    {
      githubLink: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "github_link",
      },
      additionalLink: {
        type: DataTypes.STRING,
        field: "additional_link",
      },
      comment: {
        type: DataTypes.STRING,
        field: "comment",
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
    { tableName: "project" }
  );

  return Project;
};
