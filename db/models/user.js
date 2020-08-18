"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: "username",
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(value) {
          const normalizedEmail = value.trim().toLowerCase();
          this.setDataValue("email", normalizedEmail);
        },
        validate: {
          isEmail: {
            msg: "signup.invalidEmail",
          },
        },
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
      isTeacher: {
        type: DataTypes.BOOLEAN,
        field: "is_teacher",
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
