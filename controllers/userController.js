const uuid = require("uuid");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Op } = require("sequelize");

const User = require("../models/db").User;

const emailHandler = require("../handlers/emailHandler");
const authService = require("../services/authService");
const COOKIE_CONFIG = require("../config").COOKIE_CONFIG;

exports.signupUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hash = await argon2.hash(password);

    const newUser = {
      id: uuid.v4(),
      username,
      email,
      password: hash,
    };
    // Store user in db
    const userData = await User.create(newUser);

    // create object with data from db to pass to api, minus password
    const createdUser = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
    };

    emailHandler.sendEmail({
      subject: "Welcome to the Message Board!",
      filename: "signupEmail",
      user: {
        username,
        email,
      },
    });

    res.json(createdUser);
  } catch (error) {
    console.log(error);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { jwt, user } = await authService.loginWithPassword(email, password);
    res.cookie("jwt", jwt, COOKIE_CONFIG);

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.log(err);
  }
};

// exports.checkLoggedIn = async (req, res) => {
//   const { id } = req.body;
//   const user = User.findOne({ where: { id: id } });
//   res.json({ user });
// };

// set up password reset token and send email with url
exports.generatePasswordReset = async (req, res) => {
  try {
    //Grab email from client
    const { email } = req.body;

    //Find email in db
    const userRecord = User.findOne({ where: { email: email } });

    //If no email match, don't tell them that - pass message that email will be sent
    if (!userRecord) {
      res.json({ message: "An email has been sent to the address provided." });

      // else if email match
    } else {
      // create reset password token
      const resetToken = crypto.randomBytes(25).toString("hex");
      // set expiration of token
      const resetExpiry = Date.now() + 1000 * 60 * 60;
      // update db with reset password token and expiry
      await User.update(
        { resetPasswordToken: resetToken, resetPasswordExpiry: resetExpiry },
        { where: { email } }
      );
      // create link with current host and reset token - req.headers.host is host and port number of server req is sent to
      const resetPasswordUrl = `http://${req.headers.host}/users/password-reset/${resetToken}`;
      // send email containing link and pass url to ejs template
      emailHandler.sendEmail({
        subject: "Password Reset for Challenge Board",
        filename: "resetPasswordEmail",
        user: { email },

        resetPasswordUrl,
      });
      //send json confirmation
      res.json({ message: "An email has been sent to the address provided." });
    }
  } catch (err) {
    console.log(err);
  }
};

// When user clicks URL in email, handle password reset and store in db
exports.passwordReset = async (req, res) => {
  try {
    // Grab token from url params
    const { token } = req.params;
    // Find user in db where token matches reset token and password expiry is greater than right now
    const userRecord = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpiry: { [Op.gt]: Date.now() },
      },
    });
    // If no matching user with reset token in db, or if token expired
    if (!userRecord) {
      res.json({
        message:
          "Token not found or has expired. Try resetting your password again.",
      });

      // else if matching user
    } else {
      // Grab new password from form
      const { password } = req.body;
      // await hashed password
      const hash = await argon2.hash(password);
      // Update user in db
      userRecord.update({ password: hash });
      // send along another cookie with token so they're logged in
      res.cookie("jwt", generateJWT(userRecord), {
        httpOnly: true,
        maxAge: 3600000,
      });
      // Send data
      res.json({
        message: "Password Updated",

        id: userRecord.id,
        email: userRecord.email,
        username: userRecord.username,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
