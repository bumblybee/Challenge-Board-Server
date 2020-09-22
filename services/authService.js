const User = require("../db").User;
const { Op } = require("sequelize");
const roles = require("../enums/roles");
const emailHandler = require("../handlers/emailHandler");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { CustomError } = require("../handlers/errorHandlers");
const { logger } = require("../handlers/logger");

exports.generateJWT = (user) => {
  const data = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  const secret = Buffer.from(process.env.JWT_SECRET, "base64");
  const expiration = "4h";
  return jwt.sign({ data }, secret, {
    expiresIn: expiration,
  });
};

exports.createTeacherUser = async (username, email, password) => {
  const hash = await argon2.hash(password);

  const newTeacher = {
    username,
    email,
    password: hash,
    role: roles.Teacher,
  };
  // Store user in db
  const teacherData = await User.create(newTeacher);

  logger.info(`Teacher ${teacherData.username} created`);

  // create object with data from db to pass to api, minus password
  const createdUser = {
    id: teacherData.id,
    username: teacherData.username,
    email: teacherData.email,
    role: teacherData.role,
  };

  emailHandler.sendEmail({
    subject: "Welcome to the Message Board!",
    filename: "signupEmail",
    user: {
      username,
      email,
    },
  });

  logger.info(`Signup email sent to ${email}`);

  return createdUser;
};

exports.signupUser = async (email, username, password) => {
  const existingCredentials = await User.findOne({
    where: { [Op.or]: [{ email: email }, { username: username }] },
  });

  if (existingCredentials) {
    throw new CustomError("auth.existingCredentials", "SignupError", 401);
    return;
  } else {
    const hash = await argon2.hash(password);

    const newUser = {
      username,
      email,
      password: hash,
      role: roles.Student,
    };

    // Store user in db
    const createdUser = await User.create(newUser);

    if (createdUser) {
      emailHandler.sendEmail({
        subject: "Welcome to the Message Board!",
        filename: "signupEmail",
        user: {
          username,
          email,
        },
      });

      logger.info(`Signup email sent to ${email}`);

      const jwt = this.generateJWT(createdUser);

      const user = {
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
        role: createdUser.role,
      };

      return { jwt, user };
    } else {
      throw new CustomError("auth.failedSignup", "SignupError", 401);
    }
  }
};

exports.loginWithPassword = async (email, password) => {
  const userRecord = await User.findOne({ where: { email: email } });

  if (!userRecord) {
    //Handle login failure
    throw new CustomError("auth.invalidCredentials", "LoginError", 403);
  } else {
    const correctPassword = await argon2.verify(userRecord.password, password);

    if (!correctPassword) {
      //handle error - how without access to res?
      throw new CustomError("auth.invalidCredentials", "LoginError", 401);
    }
    const jwt = this.generateJWT(userRecord);

    const user = {
      id: userRecord.id,
      username: userRecord.username,
      email: userRecord.email,
      role: userRecord.role,
    };

    return {
      jwt,
      user,
    };
  }
};

exports.signupDiscordUser = async (email, username) => {
  const createdUser = await createDiscordUserInDB(email, username);

  // send welcome email
  emailHandler.sendEmail({
    subject: "Welcome to the Message Board!",
    filename: "signupEmail",
    user: {
      username,
      email,
    },
  });

  logger.info(`Signup email sent to ${email}`);

  return createdUser;
};

const createDiscordUserInDB = async (email, username) => {
  const user = {
    username,
    email,
    hasDiscordLogin: true,
    role: roles.Student,
  };

  const existingCredentials = await User.findOne({
    where: { [Op.or]: [{ email: email }, { username: username }] },
  });

  if (existingCredentials) {
    throw new Error("auth.existingCredentials", "SignupError", 400);
  } else {
    const newUser = await User.create(user);
    const createdUser = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    };

    return createdUser;
  }
};

exports.loginDiscordUser = async (email, username) => {
  const createdUser = await findDiscordUserInDB(email, username);

  return createdUser;
};

const findDiscordUserInDB = async (email, username) => {
  const user = {
    username,
    email,
    hasDiscordLogin: true,
    role: roles.Student,
  };

  const existingCredentials = await User.findOne({
    where: { [Op.or]: [{ email: email }, { username: username }] },
  });

  const createdUser = {
    id: existingCredentials.id,
    username: existingCredentials.username,
    email: existingCredentials.email,
    role: existingCredentials.role,
  };

  return createdUser;
};
