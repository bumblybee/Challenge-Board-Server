const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Op } = require("sequelize");
const { logger } = require("../handlers/logger");
const { RESET_PASSWORD_URL } = require("../config");

const User = require("../db").User;
const Question = require("../db").Question;
const Comment = require("../db").Comment;
const Project = require("../db").Project;

const emailHandler = require("../handlers/emailHandler");
const authService = require("../services/authService");
const { CustomError } = require("../handlers/errorHandlers");
const COOKIE_CONFIG = require("../config").COOKIE_CONFIG;

exports.signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  const { jwt, user } = await authService.signupUser(email, username, password);

  logger.info(
    `Successful Signup - user id: ${user.id}, username: ${user.username}, role: ${user.role}`
  );

  if (user) {
    res.cookie("jwt", jwt, COOKIE_CONFIG);

    res.json(user);
  } else {
    res.json({ error });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const { jwt, user } = await authService.loginWithPassword(email, password);

  logger.info(
    `Successful Login - user id: ${user.id}, username: ${user.username}, role: ${user.role}`
  );

  res.cookie("jwt", jwt, COOKIE_CONFIG);

  if (user) {
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } else {
    res.json({ error });
  }
};

exports.logoutUser = (req, res) => {
  res.clearCookie("jwt", COOKIE_CONFIG).json({ message: "User logged out" });
};

exports.getUser = async (req, res) => {
  const { id } = req.token.data;
  const user = await User.findOne({
    where: { id },
    attributes: ["id", "username", "email", "role"],
    include: [
      {
        model: Project,
        order: [["createdAt", "DESC"]],
      },
      {
        model: Question,
        order: [["createdAt", "DESC"]],
      },
      {
        model: Comment,

        order: [["createdAt", "DESC"]],
      },
    ],
  });

  res.json({ user });
};

// set up password reset token and send email with url
exports.generatePasswordReset = async (req, res) => {
  //Grab email from client
  const { email } = req.body;

  logger.info(`Password reset initiated for ${email}`);

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
    const resetPasswordUrl = `${RESET_PASSWORD_URL}/${resetToken}`;

    // send email containing link and pass url to ejs template
    emailHandler.sendEmail({
      subject: "Password Reset for Challenge Board",
      filename: "resetPasswordEmail",
      user: { email },

      resetPasswordUrl,
    });

    logger.info(`Password reset email sent to ${email}`);

    //send json confirmation
    res.json({ message: "An email has been sent to the address provided." });
  }
};

// When user clicks URL in email, handle password reset and store in db
exports.passwordReset = async (req, res) => {
  // Grab token from url params
  const { token } = req.params;
  // Find user in db where token matches reset token and password expiry is greater than right now
  const userRecord = await User.findOne({
    where: {
      resetPasswordToken: token,
      resetPasswordExpiry: { [Op.gt]: Date.now() },
      hasDiscordLogin: { [Op.not]: true },
    },
  });
  // If no matching user with reset token in db, or if token expired
  if (!token || !userRecord) {
    throw new CustomError("auth.noToken", "PasswordResetError", 401);
    // else if matching user
  } else {
    // Grab new password from form
    const { password } = req.body;
    // await hashed password
    const hash = await argon2.hash(password);
    // Update user in db
    userRecord.update({ password: hash });
    // send along another cookie with token so they're logged in

    logger.info(
      `Successful Password Reset - user id ${userRecord.id}, username: ${userRecord.username}`
    );

    res.cookie("jwt", authService.generateJWT(userRecord), COOKIE_CONFIG);
    // Send data
    res.json({
      message: "Password Updated",

      id: userRecord.id,
      email: userRecord.email,
      username: userRecord.username,
    });
  }
};
