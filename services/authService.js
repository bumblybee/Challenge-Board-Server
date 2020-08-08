const User = require("../models/db").User;
const emailHandler = require("../handlers/emailHandler");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");

exports.generateJWT = (user) => {
  const userData = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  const secret = Buffer.from(process.env.JWT_SECRET, "base64");
  const expiration = "3m";
  return jwt.sign({ userData }, secret, {
    expiresIn: expiration,
    // algorithm: "HS256",
  });
};

exports.loginWithPassword = async (email, password) => {
  try {
    const userRecord = await User.findOne({ where: { email: email } });

    if (!userRecord) {
      //Handle login failure
      throw new Error("User not found");
    } else {
      const correctPassword = await argon2.verify(
        userRecord.password,
        password
      );

      if (!correctPassword) {
        throw new Error("Incorrect Password");
      }
      const jwt = generateJWT(userRecord);

      return {
        jwt,
        user: userRecord,
      };
    }
  } catch (err) {
    console.log(err);
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
      id: uuid.v4(),
      username,
      email,
      hasDiscordLogin: true,
    };

    const newUser = await User.create(user);
    const createdUser = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    };
    return createdUser;
  } catch (err) {
    console.log(err);
  }
};
