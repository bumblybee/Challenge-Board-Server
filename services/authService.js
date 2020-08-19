const User = require("../db").User;
const roles = require("../enums/roles");
const emailHandler = require("../handlers/emailHandler");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

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

  const newUser = {
    username,
    email,
    password: hash,
    role: roles.Teacher,
  };
  // Store user in db
  const userData = await User.create(newUser);

  // create object with data from db to pass to api, minus password
  const createdUser = {
    id: userData.id,
    username: userData.username,
    email: userData.email,
    role: userData.role,
  };

  // emailHandler.sendEmail({
  //   subject: "Welcome to the Message Board!",
  //   filename: "signupEmail",
  //   user: {
  //     username,
  //     email,
  //   },
  // });

  return createdUser;
};

exports.loginWithPassword = async (email, password) => {
  const userRecord = await User.findOne({ where: { email: email } });

  if (!userRecord) {
    //Handle login failure
    throw new Error("login.invalidCredentials");
  } else {
    const correctPassword = await argon2.verify(userRecord.password, password);

    if (!correctPassword) {
      //handle error - how without access to res?
      throw new Error("login.invalidCredentials");
    }
    const jwt = this.generateJWT(userRecord);

    //Fix so not returning password
    return {
      jwt,
      user: userRecord,
    };
  }
};

// Maybe put sendWelcomeEmail in createDiscordUser and only have one function, or just use this to send email and call createDiscorderUser elsewhere
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

  return createdUser;
};

const createDiscordUserInDB = async (email, username) => {
  try {
    const user = {
      username,
      email,
      hasDiscordLogin: true,
      role: roles.Student,
    };

    const newUser = await User.create(user);
    const createdUser = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    };
    return createdUser;
  } catch (err) {
    console.log(err);
  }
};
