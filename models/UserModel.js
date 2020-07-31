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
      hasDiscordLogin: {
        type: DataTypes.BOOLEAN,
        field: "has_discord_login",
      },
    },
    { tableName: "User" }
  );
  return User;
};
