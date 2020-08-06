const User = require("../models/db").User;
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

generateJWT = (user) => {
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

exports.signupDiscordUser = async (email, username) => {
  const createdUser = await createDiscordUser(email, username);
  // add this when you're ready
  // sendWelcomeSignupEmail(email, username)

  return createdUser;
};

async function createDiscordUser(email, username) {
  const user = {
    id: uuid.v4(),
    username,
    email,
    hasDiscordLogin: true,
  };
  const userModel = await User.create(user);
  const createdUser = {
    id: userModel.id,
    username: userModel.username,
    email: userModel.email,
  };
  return createdUser;
}
