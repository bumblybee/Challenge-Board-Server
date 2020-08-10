const { database } = require("faker");

exports.UserModel = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
        field: "id",
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: "username",
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        field: "email",
      },
      password: {
        type: DataTypes.STRING,
        field: "password",
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
        field: "reset_password_token",
      },
      resetPasswordExpiry: {
        type: DataTypes.DATE,
        field: "reset_password_expiry",
      },
      hasDiscordLogin: {
        type: DataTypes.BOOLEAN,
        field: "has_discord_login",
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
    { tableName: "user" }
  );
  return User;
};
